import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationStrategy {
    constructor() { }

    async formatDate(yyyymmdd: number): Promise<string> {
        const s = yyyymmdd.toString();
        //retorna a data dd/mm/yyyy
        return `${s.slice(6, 8)}/${s.slice(4, 6)}/${s.slice(0, 4)}`;
    }

    async formatToYYYYMMDD(date: Date): Promise<number> {
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        return parseInt(`${year}${month}${day}`);
    }
}
