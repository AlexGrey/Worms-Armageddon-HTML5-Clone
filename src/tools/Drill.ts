///<reference path="../system/Physics.ts"/>
///<reference path="../system/Utilies.ts" />
///<reference path="../Worm.ts" />
///<reference path="../animation/Sprite.ts"/>


class Drill
{
    worm : Worm;
    isActive;
    startTime;
    ammo;
    timeSinceLastExplosion;
    timeBetweenExplosions;

    constructor ()
    {
        this.isActive = false;

        this.timeBetweenExplosions = 200;
        
        //Physics.addContactListener(function (contact) => {

        //    if (Physics.isObjectColliding(Terrain.userData, this.worm.body.GetUserData(), contact))
        //    {
        //        if (this.startTime > 0)
        //        {
        //            Game.terrain.addToDeformBatch(Physics.metersToPixels(this.worm.body.GetPosition().x), Physics.metersToPixels(this.worm.body.GetPosition().y), 25);
        //        }
        //    }
           
        //    return !this.isActive;
        //});
    }

    active(worm : Worm)
    {
        this.worm = worm;
        this.isActive = true;
        this.startTime = Date.now();
        this.worm.setSpriteDef(Sprites.worms.drill,true);
                       
    }

    update()
    {
        if (this.isActive)
        {
            
            this.timeSinceLastExplosion += Date.now() - this.timeSinceLastExplosion;

            if (Date.now() - this.startTime > 2000)
            {
                this.isActive = false;
                Logger.debug(" deactivedate ");
                this.worm.setSpriteDef(Sprites.worms.drill,false);
                this.worm.setSpriteDef(Sprites.worms.lookAround);
            }

            if (this.timeSinceLastExplosion > this.timeBetweenExplosions)
            {
                AssetManager.sounds["DRILL"].play();
                Game.terrain.addToDeformBatch(Physics.metersToPixels(this.worm.body.GetPosition().x), Physics.metersToPixels(this.worm.body.GetPosition().y), 25);
                this.timeSinceLastExplosion = 0;
            }
            
        }

    }

}