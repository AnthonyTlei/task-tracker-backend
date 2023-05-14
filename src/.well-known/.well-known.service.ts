import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WellKnownService {
  getPluginManifest() {
    const filepath = path.join(__dirname, '..', 'config/openai', 'ai-plugin.json');
    return fs.readFileSync(filepath, 'utf8');
  }

  getPluginDefinition() {
    const filepath = path.join(__dirname, '..', 'config/openai', 'openapi.yaml');
    return fs.readFileSync(filepath, 'utf8');
  }
}
