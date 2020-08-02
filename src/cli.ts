#!/usr/bin/env node
import * as commander from 'commander';
import {translate} from './main';

const program = new commander.Command();
program
  .version('0.0.3')
  .name('translation')
  .usage('<English>')
  .arguments('<English>')
  .action((english) => {
    translate(english);
  });

program.parse(process.argv);