import { getModelForClass, prop } from "@typegoose/typegoose";

class Apps {

    @prop()
    public Name?: string;

    @prop()
    public Version?: string;

    @prop()
    public Hash?: string

}

export const HashesDB = getModelForClass(Apps)