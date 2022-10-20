export type Dungeon3 = {
  version: "0.1.0";
  name: "dungeon3";
  instructions: [
    {
      name: "setUser";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "score";
          type: "u64";
        },
        {
          name: "map";
          type: "u8";
        },
        {
          name: "health";
          type: "u8";
        }
      ];
    },
    {
      name: "initUser";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "newUserAccount";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "user";
              },
              {
                kind: "account";
                type: "publicKey";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "addItem";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "itemAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "exportItems";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "itemAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "initItem";
      accounts: [
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "newItemAccount";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "item";
              },
              {
                kind: "account";
                type: "publicKey";
                path: "authority";
              },
              {
                kind: "arg";
                type: "u8";
                path: "id";
              }
            ];
          };
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "id";
          type: "u8";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "userAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "score";
            type: "u64";
          },
          {
            name: "map";
            type: "u8";
          },
          {
            name: "health";
            type: "u8";
          },
          {
            name: "created";
            type: "i64";
          },
          {
            name: "updated";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "itemAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "id";
            type: "u8";
          },
          {
            name: "quantity";
            type: "u64";
          },
          {
            name: "exports";
            type: "u8";
          }
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
      name: "setUser",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "score",
          type: "u64",
        },
        {
          name: "map",
          type: "u8",
        },
        {
          name: "health",
          type: "u8",
        },
      ],
    },
    {
      name: "initUser",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "newUserAccount",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "user",
              },
              {
                kind: "account",
                type: "publicKey",
                path: "authority",
              },
            ],
          },
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "addItem",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "itemAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "exportItems",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "itemAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "initItem",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "newItemAccount",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "item",
              },
              {
                kind: "account",
                type: "publicKey",
                path: "authority",
              },
              {
                kind: "arg",
                type: "u8",
                path: "id",
              },
            ],
          },
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "id",
          type: "u8",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "userAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "score",
            type: "u64",
          },
          {
            name: "map",
            type: "u8",
          },
          {
            name: "health",
            type: "u8",
          },
          {
            name: "created",
            type: "i64",
          },
          {
            name: "updated",
            type: "i64",
          },
        ],
      },
    },
    {
      name: "itemAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "id",
            type: "u8",
          },
          {
            name: "quantity",
            type: "u64",
          },
          {
            name: "exports",
            type: "u8",
          },
        ],
      },
    },
  ],
};
