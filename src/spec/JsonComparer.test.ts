import { jsonComparer as jc } from './../JsonComparer';
import * as testTools from '../testTools';
import * as _ from 'lodash';

const testData: testTools.testInput[] = [
  {
    expected: false,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'asdffd', y: { fdsa: 1 }, s: 1 },
    },
    testFn: input => jc.isSubset(input.json1, input.json2),
    label: 'isSubset - not a subset check',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 123, y: { z: 1 }, jk: 'extra' },
    },
    testFn: input => jc.isSubset(input.json1, input.json2),
    label: 'isSubset - is a subset check',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'ban', y: { z: 'anas' }, jk: 'extra' },
    },
    testFn: input => jc.isSubsetKeys(input.json1, input.json2),
    label: 'isSubsetKeys - is a subset check',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { x1: 123, y: { z: 1 } },
      json2: { x: 'ban', y: { z: 'anas' }, jk: 'extra' },
    },
    testFn: input => jc.isSubsetKeys(input.json1, input.json2),
    label: 'isSubsetKeys - is not a subset check',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'asdffd', y: { fdsa: 1 } },
    },
    testFn: input => jc.sameKeys(input.json1, input.json2),
    label: 'sameKeys - for jsons with same keys',
    shouldRun: true,
  },
  {
    expected: true,
    input: {},
    testFn: input => jc.isJSON(input),
    label: 'isJson - {}',
    shouldRun: true,
  },
  {
    expected: true,
    input: '{}',
    testFn: input => jc.isJSON(input),
    label: 'isJson - "{}"',
    shouldRun: true,
  },
  {
    expected: true,
    input: { x: 1, y: { yy: [1, 2, { x: 'x' }, 2.2, []] } },
    testFn: input => jc.isJSON(input),
    label: 'isJson - complex json structure',
    shouldRun: true,
  },
  {
    expected: true,
    input: '{"a":0, "bas-dsf": "asdfff", "b0d": [1,2.3,"23",{},{"i": {"x":"games"}}]}',
    testFn: input => jc.isJSON(input),
    label: 'isJson - complex json structure in a string',
    shouldRun: true,
  },
  {
    expected: false,
    input: 'x',
    testFn: input => jc.isJSON(input),
    label: 'isJson - "x"',
    shouldRun: true,
  },
  {
    expected: false,
    input: '',
    testFn: input => jc.isJSON(input),
    label: 'isJson - ""',
    shouldRun: true,
  },
  {
    expected: true,
    input: '[]',
    testFn: input => jc.isJSON(input),
    label: 'isJson() - "[]"',
    shouldRun: true,
  },
  {
    expected: true,
    input: [1, '', { x: [2] }],
    testFn: input => jc.isJSON(input),
    label: "isJson() - [1, '', { x: [2] }]",
    shouldRun: true,
  },
  {
    expected: true,
    input: [],
    testFn: input => jc.isJSON(input),
    label: 'isJson() - []',
    shouldRun: true,
  },
  {
    expected: false,
    input: '1',
    testFn: input => jc.isJSON(input),
    label: 'isJson() - "1"',
    shouldRun: true,
  },
  {
    expected: false,
    input: null,
    testFn: input => jc.isJSON(input),
    label: 'isJson() - null',
    shouldRun: true,
  },
  {
    expected: false,
    input: undefined,
    testFn: input => jc.isJSON(input),
    label: 'isJson() - undefined',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { x: 123, y: { z: 1 } },
      json2: { x: 'asdffd', y: { fdsa: 1 }, s: 1 },
    },
    testFn: input => jc.sameKeys(input.json1, input.json2),
    label: 'sameKeys - for jsons with different keys',
    shouldRun: true,
  },
  {
    expected: true,
    input: { array1: [1, 2, { qq: ';-;' }], array2: [{ qq: ';-;' }, 2, 1] },
    testFn: input => jc.containSameElements(input.array1, input.array2),
    label: 'containSameElements - Check if the arrays have the same elements.',
    shouldRun: true,
  },
  {
    expected: true,
    input: { array1: [1, 2, { qq: ';-;' }], array2: [{ qq: ';-;' }, 2, 1] },
    testFn: input => jc.containSameElementsWith(input.array1, input.array2, _.isEqual),
    label: 'containSameElementsWith - Check if the arrays have the same elements.',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { x1: 'BIGBOY', y: { z: 1 } },
      json2: { x: 'bigboy', y: { z: 'anas' }, jk: 'extra' },
    },
    testFn: input =>
      jc.isSubsetSpecialCases(
        input.json1,
        input.json2,
        ['x1', 'y'],
        [(sub, sup) => _.isEqual(sub.toLowerCase(), sup.toLowerCase()), (sub, sup) => jc.sameKeys(sub, sup)],
        ['x', 'y']
      ),
    label: 'isSubsetSpecialCases - is a subset check',
    shouldRun: true,
  },
  {
    expected: ['zengarden_ben', 'qq.benzen', 'zengarden_ben.zen', 'zengarden_ben.zen.kind.zenny'],
    input: { json: { zengarden_ben: { zen: { kind: { zenny: 1 } } }, qq: { benzen: 2 } }, pattern: 'zen' },
    testFn: input => jc.findAllKeyPaths(input.json, input.pattern),
    label: 'findAllKeyPaths - that contain zen',
    shouldRun: true,
  },
  {
    expected: ['super_pOweRful', 'super_pOweRful.PoWeRpOwEr', 'kind.plusultra.qq.power_slow_PoweR'],
    input: {
      json: {
        super_pOweRful: { PoWeRpOwEr: 1 },
        kind: { plusultra: { qq: { power_slow_PoweR: 1 } }, nothingCoolHere: { x: 1, y: 3, zzz: { zzzzz: { I: 9 } } } },
      },
      pattern: 'power',
      regexOptions: 'gi',
    },
    testFn: input => jc.findAllKeyPaths(input.json, input.pattern, input.regexOptions),
    label: 'findAllKeyPaths - that contain power with case insensitive and global flags',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: {},
      json2: {},
    },
    testFn: input => jc.sameTypes(input.json1, input.json2),
    label: 'sameTypes - 2 empty jsons',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      list1: [],
      list2: [],
    },
    testFn: input => jc.sameTypes(input.list1, input.list2),
    label: 'sameTypes - 2 empty lists',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      list1: [{ x: 'pie', y: [1, 2, 3] }, 3, '', [1, 2, 3], {}, 3],
      list2: [{ x: 'apple between the skys', y: [2, 3, 1] }, 34, 'hi', [23, 2, 3], {}, 2345],
    },
    testFn: input => jc.sameTypes(input.list1, input.list2),
    label: 'sameTypes - 2 complex lists',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      list1: [{ x: 'pie', y: [1, 2, 3] }, 3, '', [1, 2, 3], {}, 3],
      list2: [{ x: 'apple between the skys', y: [2, 3, 1] }, 34, 'hi', [23, 2, 3], {}, 2345],
    },
    testFn: input => jc.sameTypes(input.list1, input.list2, {}),
    label: 'sameTypes - 2 complex lists with an empty options given',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      list1: [{ x: 'pie', y: [1, '', 3] }, 3, '', [1, 2, 3], {}, 3],
      list2: [{ x: 'pie', y: [1, 2, 3] }, 3, '', [1, 2, 3], {}, 3],
    },
    testFn: input => jc.sameTypes(input.list1, input.list2),
    label: 'sameTypes - 2 complex lists with slightly different types',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { x: [22, 2, 44], ghost: { jame: [[[]]], kay: 'jay' } },
      json2: { x: [1, 2, 3], ghost: { jame: [[[]]], kay: 1 } },
    },
    testFn: input => jc.sameTypes(input.json1, input.json2),
    label: 'sameTypes - 2 complex jsons with slightly different types',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { a: 1, b: 2, c: 3 },
      json2: { aa: 1, bb: 2, cc: 3 },
    },
    testFn: input => jc.sameTypes(input.json1, input.json2),
    label: 'sameTypes - 2 jsons with different keys but the same types',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { a: 1, b: 2, c: 3 },
      json2: { a: 33, b: 66, c: 3, d: 4 },
    },
    testFn: input => jc.sameTypes(input.json1, input.json2),
    label: 'sameTypes - 2 jsons where one json has more keys',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { b: 3453453, c: 434, a: 234 },
      json2: { a: 1, b: 2, c: 3 },
    },
    testFn: input => jc.sameTypes(input.json1, input.json2),
    label: 'sameTypes - 2 jsons with same keys but created in different order',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { b: null, c: 434, a: 234 },
      json2: { a: 1, b: 2, c: 3 },
    },
    testFn: input => jc.sameTypes(input.json1, input.json2, { nullableKeys: ['b'] }),
    label: 'sameTypes - 2 jsons with same keys but with 1 nullable root key',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { b: null, c: { x: { j: 1 } }, a: 234 },
      json2: { a: 1, b: 2, c: { x: { j: null } } },
    },
    testFn: input => jc.sameTypes(input.json1, input.json2, { nullableKeys: ['b', 'c.x.j'] }),
    label: 'sameTypes - 2 jsons with same keys but with 1 nullable root key and 1 nullable nested key',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { b: null, c: { x: { j: 1 } }, a: [1, 3] },
      json2: { a: [1, 2, 3], b: 2, c: { x: { j: null } } },
    },
    testFn: input => jc.sameTypes(input.json1, input.json2, { nullableKeys: ['b', 'c.x.j'], subsetListCheck: true }),
    label:
      'sameTypes - 2 jsons with same keys but with subset list check 1 nullable root key and 1 nullable nested key',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { a: [1, 'asdf'] },
      json2: { a: [1, 2, 3] },
    },
    testFn: input =>
      jc.sameTypes(input.json1, input.json2, {
        checkFirstInList: true,
      }),
    label: 'sameTypes - 2 jsons with same keys but with check first in list flag true',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { a: [] },
      json2: { a: [1, 2, 3] },
    },
    testFn: input =>
      jc.sameTypes(input.json1, input.json2, {
        emptyListIsAcceptable: true,
      }),
    label: 'sameTypes - 2 jsons with same keys but with empty lists marked as acceptable',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: [
        {
          id: 1522292,
          name: 'Bug',
          sequence: null,
          priority: 0,
          color: '#D9534F',
          textColor: '#FFFFFF',
        },
        {
          id: 1522293,
          name: 'Enhancement',
          sequence: null,
          priority: 1,
          color: '#428BCA',
          textColor: '#FFFFFF',
        },
      ],
    },
    testFn: input =>
      jc.sameTypes(input.json1, input.json1, {
        emptyListIsAcceptable: true,
      }),
    label: 'sameTypes - 1 json with api like data',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: {
        issues: [
          {
            id: 1,
            title: 'string',
            url: 'string',
            createdTime: 'string',
            updatedTime: 'string',
            closedTime: 'string',
            assignedUsername: 'string',
            labels: [1],
          },
        ],
        tag: 'string',
      },
      json2: {
        issues: [
          {
            id: 44552,
            title: 'yaeeee',
            url: 'www.asdfasdf.com',
            createdTime: '2019-02-12T15:46:54.467Z',
            updatedTime: '2020-04-21T15:33:43.89Z',
            closedTime: null,
            assignedUsername: null,
            labels: [8845435, 687435],
          },
          {
            id: 44552,
            title: 'yaeeee',
            url: 'www.asdfasdf.com',
            createdTime: '2019-02-12T15:46:54.467Z',
            updatedTime: '2020-04-21T15:33:43.89Z',
            closedTime: null,
            assignedUsername: null,
            labels: [8845435, 687435],
          },
          {
            id: 44552,
            title: 'yaeeee',
            url: 'www.asdfasdf.com',
            createdTime: '2019-02-12T15:46:54.467Z',
            updatedTime: '2020-04-21T15:33:43.89Z',
            closedTime: '',
            assignedUsername: 'asdfs',
            labels: [8845435, 687435],
          },
        ],
        tag: 'boy',
      },
    },
    testFn: input =>
      jc.sameTypes(input.json1, input.json2, {
        nullableKeys: ['issues.closedTime', 'issues.assignedUsername'],
        subsetListCheck: true,
      }),
    label: 'sameTypes - a json contract with a json as some type check flags',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      json1: { a: { j: [{ d: '2222-12-29' }, { d: '03/13/2019' }] }, date: '05/06/1997', u: 1000 },
      json2: { a: { j: [{ d: '2000-01-19' }, { d: '05/23/2018' }] }, date: '07/26/2007', u: 8 },
    },
    testFn: input =>
      jc.sameTypes(input.json1, input.json2, {
        dateKeys: ['a.j.d', 'date'],
      }),
    label: 'sameTypes - true. 2 jsons with same keys with date checks',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      json1: { a: { j: [{ d: 's2222-12-29' }, { d: '03/13/2019' }] }, date: '05/06/1997', u: 1000 },
      json2: { a: { j: [{ d: '2000-01-19' }, { d: '05/23/2018' }] }, date: '07/26/2007', u: 8 },
    },
    testFn: input =>
      jc.sameTypes(input.json1, input.json2, {
        dateKeys: ['a.j.d', 'date'],
      }),
    label: 'sameTypes - false 2 jsons with same keys with date checks, with an invalid date string',
    shouldRun: true,
  },
  {
    expected: false,
    input: {
      contractJson: { a: { j: [{ d: '2222-12-29' }] }, date: '05/06/1997', u: 1000 },
      json: { a: { j: [{ d: '2000-01-19' }, { d: '05s/23/2018' }] }, date: '07/26/2007', u: 8 },
    },
    testFn: input =>
      jc.typecheck(input.json, input.contractJson, {
        dateKeys: ['a.j.d', 'date'],
      }),
    label: 'typecheck - false json with date checks, with an invalid date string',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      contractJson: { a: { j: [{ d: '2222-12-29' }] }, date: '05/06/1997', u: 1000, z: { h: [{ y: '2000-11-11' }] } },
      json: {
        a: { j: [{ d: '2000-01-19' }, { d: '05/23/2018' }] },
        date: '07/26/2007',
        u: 8,
        z: { h: [{ y: '2000-11-11' }] },
      },
    },
    testFn: input =>
      jc.typecheck(input.json, input.contractJson, {
        dateKeys: ['a.j.d', 'date', 'z.h.y'],
      }),
    label: 'typecheck - true json with date checks',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      contractJson: { a: { j: [{ d: '2222-12-29' }] }, z: { k: [1] }, l: [''], u: 1000, qq: [1], bb: [''] },
      json: { a: { j: [] }, z: { k: [1, 2, 3] }, l: [], u: 8, qq: [44, 33, 21], bb: null },
    },
    testFn: input =>
      jc.typecheck(input.json, input.contractJson, {
        dateKeys: ['a.j.d'],
        emptyListKeys: ['a.j', 'z.k', 'l', 'bb'],
        nullableKeys: ['bb'],
      }),
    label: 'typecheck - true json with empty list checks',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      contractJson: [{ a: { j: [{ d: '2222-12-29' }] }, z: { k: [1] }, l: [''], u: 1000, qq: [1] }],
      json: [],
    },
    testFn: input =>
      jc.typecheck(input.json, input.contractJson, {
        emptyRootListAcceptable: true,
      }),
    label: 'typecheck - true list with empty root list acceptable',
    shouldRun: true,
  },
  {
    expected: true,
    input: {
      contractJson: [{ a: { j: [{ d: '2222-12-29' }] }, z: { k: [1] }, l: [''], u: 1000, qq: [1] }],
      json: [{ a: { j: [] }, z: { k: [1, 2, 3] }, l: [], u: 8, qq: null }],
    },
    testFn: input =>
      jc.typecheck(input.json, input.contractJson, {
        dateKeys: ['a.j.d'],
        emptyListKeys: ['a.j', 'z.k', 'l', 'qq'],
        nullableKeys: ['qq'],
      }),
    label: 'typecheck - true json with null check',
    shouldRun: true,
  },
];

testTools.tester(testData);
