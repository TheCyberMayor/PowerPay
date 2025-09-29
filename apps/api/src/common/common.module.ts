import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { EncryptionService } from './services/encryption.service';
import { ValidationService } from './services/validation.service';
import { UtilsService } from './services/utils.service';

@Global()
@Module({
  providers: [
    LoggerService,
    EncryptionService,
    ValidationService,
    UtilsService,
  ],
  exports: [
    LoggerService,
    EncryptionService,
    ValidationService,
    UtilsService,
  ],
})
export class CommonModule {}