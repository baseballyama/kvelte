// 参考: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import

// Normal Import
import defaultExport from "module-name";
import * as name from "module-name";
import {export1} from "module-name";
import {export1 as alias1} from "module-name";
import {export1, export2} from "module-name";
import {foo, bar} from "module-name/path/to/specific/un-exported/file";
import {export1, export2 as alias2,

[...]
}
from
"module-name";
import defaultExport, {export1

[, [...]]
}
from
"module-name";
import defaultExport, * as name from "module-name";
import "module-name";

var promise = import("module-name");

import App1 from './App1.svelte';

import fs1 from 'fs1';

// Break line 1

import App2
    from './App2.svelte';

import fs2
    from 'fs2';

// Break line 2

import
    App3
    from
        './App3.svelte';

import
    fs3
    from
        'fs3';

// Break line 3

import {
    fs4
} from 'fs4';

import {
    App4
} from './App4.svelte';