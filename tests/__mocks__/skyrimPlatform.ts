export const Game = {
  getPlayer: () => ({
    getFormId: () => 0x00000014,
    getPositionX: () => 0,
    getPositionY: () => 0,
    getPositionZ: () => 0,
    getParentCell: () => ({
      getName: () => 'Tamriel'
    }),
    addPerk: () => {},
    removePerk: () => {},
    kill: () => {},
    hasPerk: () => false,
    getActorValue: (av: string) => 15,
    setActorValue: (av: string, val: number) => {},
    getRace: () => ({ getFormId: () => 0x00013746, getName: () => 'NordRace', hasKeyword: () => false }),
    getActorBase: () => ({ getFormId: () => 0x00000007, getName: () => 'Player', hasKeyword: () => false })
  }),
  getFormFromFile: (localId: number, plugin: string) => ({
    getFormId: () => 0x08000000 | localId,
    getName: () => 'MockPerk'
  }),
  getFormEx: (formId: number) => ({
    getFormId: () => formId,
    getName: () => 'MockForm'
  })
};

export const Debug = {
  notification: () => {},
  messageBox: () => {}
};

export const Input = {
  isKeyPressed: () => false,
  tapKey: () => {}
};

export const Ui = {
  isMenuOpen: () => false
};

export const printConsole = (...args: any[]) => {};
export const on = (event: string, callback: (...args: any[]) => void) => {};
export const once = (event: string, callback: (...args: any[]) => void) => {};
