/**************************
 * @AUTHOR YONGQIAN HUANG
 * Updated in 03/09/2020 migrate to typescript *
 **************************/
import Location from '../models/location';
import Car from '../models/car';
import {calculateDistance} from '../helpers/distanceHelper';

class locationRepository{
    maximumRange: number;

    constructor(){
        this.maximumRange = 8000; //COUNT IN M
    }

    async getAll(){
        try{
            const locations = await Location.findAll({});
            return Promise.resolve(locations);
        }catch(error){
            return Promise.reject(error);
        }
    }

    async getAllValidateCars(from: string, sort: string | undefined, order: string | undefined){
        try{
            let validLocation = [];
            if(!sort || !order){
                sort = 'name';
                order = 'asc';
             }
            const locations = await Location.findAll({
                attributes: ['address'],
                include:[{
                    model: <any>Car,
                    where: {available: true}
                }],
                order: [
                    [Car, sort, order]
                ]
            });
            //Record the last element to sort the array
            let lowest = this.maximumRange;
            for await (const location of locations){
                const result = await calculateDistance(from, location.address);
                const distance = result.distance.value;
                //Default sort by distance
                if(distance <= this.maximumRange){
                    if(distance < lowest){
                        lowest = distance;
                        validLocation.unshift(location);
                    }else{
                        validLocation.push(location);
                    }
                }
            }

            return Promise.resolve(validLocation);

        }catch(error){
            return Promise.reject(error);
        }
    }
}

export default new locationRepository();