///<reference path="../system/Utilies.ts"/>
///<reference path="InstructionChain.ts"/>
declare var io;

module Client
{
    export var socket;
    export var id;
    var packetRateLimiter: Timer;
    var previous = "";

    export function connectionToServer(ip, port)
    {
        try
        {
            var dest = ip + ":" + port;
            Logger.debug(" Client connecting to " + dest);
            socket = io.connect(dest);

            socket.on(Events.client.ASSIGN_USER_ID, function (id) =>
            {
                Logger.debug(" Your have been assigned an id " + id);
                Client.id = id;
            });

            socket.on(Events.client.ACTION, function (packet) =>
            {
               var instructionSet : InstructionChain = Utilies.copy(new InstructionChain(), packet);
               instructionSet.call(GameInstance);
                
            });

            // This allows for smaller action packets
            socket.on(Events.client.CURRENT_WORM_ACTION, function (packet) =>
            {
               var instructionSet : InstructionChain = Utilies.copy(new InstructionChain(), packet);
               instructionSet.call(GameInstance.state.getCurrentPlayer().getTeam().getCurrentWorm());
                
            });

            socket.on(Events.client.UPDATE, function (packet) =>
            {
                    var physicsDataPacket = new PhysiscsDataPacket(packet);
                    physicsDataPacket.override(Physics.fastAcessList);
            });

            if (Settings.NETWORKED_GAME_QUALITY_LEVELS.HIGH == Settings.NETWORKED_GAME_QUALITY)
            {
                packetRateLimiter = new Timer(10);

            } else if (Settings.NETWORKED_GAME_QUALITY_LEVELS.MEDIUM == Settings.NETWORKED_GAME_QUALITY)
            {
                packetRateLimiter = new Timer(100);
            }
            else if (Settings.NETWORKED_GAME_QUALITY_LEVELS.LOW == Settings.NETWORKED_GAME_QUALITY)
            {
                 packetRateLimiter = new Timer(1000);
            }

            return true;

        } catch (e)
        {
            return false;
        }
    }

    export function sendRateLimited(event, packet){

        packetRateLimiter.update();

        if (GameInstance.gameType == Game.types.ONLINE_GAME && packetRateLimiter.hasTimePeriodPassed())
        {
            if (previous != packet)
            {
                Client.socket.emit(event, packet);
                previous = packet;
            }
        }
    }

    // Is the game an only one and if so is the current player == to this client
    export function isClientsTurn()
    {
        return GameInstance.gameType == Game.types.LOCAL_GAME || GameInstance.lobby.client_GameLobby.currentPlayerId == Client.id
    }

    export function sendImmediately(event, packet, rateLimiter = 0){

        if (GameInstance.gameType == Game.types.ONLINE_GAME)
        {
            Client.socket.emit(event, packet);
        }
    }

}