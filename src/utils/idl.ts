export type Dungeon3 = {
  version: "0.1.0";
  name: "dungeon3";
  instructions: [
    {
      name: "addItem";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "itemAccount"; isMut: true; isSigner: false }
      ];
      args: [];
    },
    {
      name: "initUser";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "newUserAccount"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "rent"; isMut: false; isSigner: false }
      ];
      args: [];
    },
    {
      name: "initItem";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "newItemAccount"; isMut: true; isSigner: false },
        { name: "systemProgram"; isMut: false; isSigner: false },
        { name: "rent"; isMut: false; isSigner: false }
      ];
      args: [{ name: "id"; type: "u8" }];
    },
    {
      name: "setUser";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "userAccount"; isMut: true; isSigner: false }
      ];
      args: [
        { name: "score"; type: "u64" },
        { name: "map"; type: "u8" },
        { name: "health"; type: "u8" }
      ];
    },
    {
      name: "exportItems";
      accounts: [
        { name: "authority"; isMut: true; isSigner: true },
        { name: "itemAccount"; isMut: true; isSigner: false }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "ItemAccount";
      type: {
        kind: "struct";
        fields: [
          { name: "authority"; type: "publicKey" },
          { name: "id"; type: "u8" },
          { name: "quantity"; type: "u64" },
          { name: "exports"; type: "u8" }
        ];
      };
    },
    {
      name: "UserAccount";
      type: {
        kind: "struct";
        fields: [
          { name: "authority"; type: "publicKey" },
          { name: "score"; type: "u64" },
          { name: "map"; type: "u8" },
          { name: "health"; type: "u8" }
        ];
      };
    }
  ];
};

export const IDL: Dungeon3 = {
  version: "0.1.0",
  name: "dungeon3",
  instructions: [
    {
      name: "addItem",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "itemAccount", isMut: true, isSigner: false },
      ],
      args: [],
    },
    {
      name: "initUser",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "newUserAccount", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [],
    },
    {
      name: "initItem",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "newItemAccount", isMut: true, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false },
        { name: "rent", isMut: false, isSigner: false },
      ],
      args: [{ name: "id", type: "u8" }],
    },
    {
      name: "setUser",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "userAccount", isMut: true, isSigner: false },
      ],
      args: [
        { name: "score", type: "u64" },
        { name: "map", type: "u8" },
        { name: "health", type: "u8" },
      ],
    },
    {
      name: "exportItems",
      accounts: [
        { name: "authority", isMut: true, isSigner: true },
        { name: "itemAccount", isMut: true, isSigner: false },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "ItemAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "id", type: "u8" },
          { name: "quantity", type: "u64" },
          { name: "exports", type: "u8" },
        ],
      },
    },
    {
      name: "UserAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "authority", type: "publicKey" },
          { name: "score", type: "u64" },
          { name: "map", type: "u8" },
          { name: "health", type: "u8" },
        ],
      },
    },
  ],
};
