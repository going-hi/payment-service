import { ConfigModuleOptions } from "@nestjs/config";
import { IsNumber, IsString } from "class-validator";
import { envValidate } from "src/common/env.validation";

export class EnvironmentVariables {
    @IsNumber()
    PORT: number

    @IsString()
    DATABASE_URL: string

    @IsString()
    U_KASSA_TOKEN: string

    @IsString()
    U_KASSA_SHOP_ID: string

    @IsString()
    CLIENT_URL: string
}

export const EnvConfigOptions: ConfigModuleOptions = {
    isGlobal: true,
    validate: envValidate(EnvironmentVariables)
}