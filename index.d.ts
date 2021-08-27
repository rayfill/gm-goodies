declare namespace GMGoodies {
  type HookFunction = (xhr: XMLHttpRequest, resType: string, content: any) => void;
  function GM_fetch(input: any): Promise<Response>;
  function GM_fetch(input: any, init: any): Promise<Response>;

  function xhrHook2(fun: HookFunction): void;
  function xhrHook(fun: HookFunction): void;
}

export = GMGoodies;
