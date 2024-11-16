import { MessageDto } from "../Messages/MessageDto";

export class TalkDto {
    constructor(
      public  id:string,
      public  type:string,
      public  members:string[] = [],
      public  messages:MessageDto[] = []
    ){}
};