import { IFactoryMethod } from "../factories";

/**
 * Date object extensions factory based on momment js library 
 */
export class DateExtensionsFactory implements IFactoryMethod {
    private momentFactory: any;

    constructor(private moment: any) {
        this.momentFactory = moment;
    }

    instance() : Function {
        var instace = (m: any) => {return new DateExtensionsFactory(m);}
        return instace;
    }

    public static instance() : Function {
        return this.instance();
    }
}
