// Copyright (c) 2017, Compiler Explorer Authors
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright notice,
//       this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

import path from 'path';

import {BaseCompiler} from '../base-compiler';

import {ClangParser} from './argument-parsers';

export class HaskellCompiler extends BaseCompiler {
    static get key() {
        return 'haskell';
    }

    constructor(info, env) {
        super(info, env);
        this.compiler.supportsHaskellStgView = true;
    }

    optionsForBackend(backendOptions, outputFilename) {
        const opts = super.optionsForBackend(backendOptions, outputFilename);

        if (backendOptions.produceHaskellStg && this.compiler.supportsHaskellStgView) {
            opts.push('-ddump-to-file', '-dumpdir', path.dirname(outputFilename), '-ddump-stg-final');
        }
        return opts;
    }

    optionsForFilter(filters, outputFilename) {
        const options = ['-g', '-o', this.filename(outputFilename)];
        if (!filters.binary) options.unshift('-S');
        return options;
    }

    getSharedLibraryPathsAsArguments(libraries) {
        const libPathFlag = this.compiler.libpathFlag || '-L';
        return [libPathFlag + '.', ...this.getSharedLibraryPaths(libraries).map(path => libPathFlag + path)];
    }

    getArgumentParser() {
        return ClangParser;
    }
}
