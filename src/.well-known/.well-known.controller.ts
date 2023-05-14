import { Controller, Get } from '@nestjs/common';
import { WellKnownService } from './.well-known.service';

@Controller('.well-known')
export class WellKnownController {
  constructor(private readonly wellKnownService: WellKnownService) {}
  @Get('ai-plugin.json')
  getPluginManifest() {
    return this.wellKnownService.getPluginManifest();
  }
  @Get('openapi.yaml')
  getPluginDefinition() {
    return this.wellKnownService.getPluginDefinition();
  }
}
