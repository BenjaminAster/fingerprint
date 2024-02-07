
// /// <reference no-default-lib="true" />
// /// <reference types="better-typescript" />

// globalThis.addEventListener?.("message", ({ data }) => {
// 	if (data.type === "measure-recursion-stack-size") {
// 		let stackSize = 0;
// 		try {
// 			const recursion = () => {
// 				stackSize++;
// 				recursion();
// 			};
// 			recursion();
// 		} catch {
// 			globalThis.postMessage?.({ type: "send-recursion-stack-size", stackSize });
// 		}
// 	}
// });

  onmessage = () => {
      let stackSize = 0;
      try {
          const recursion = () => {
              stackSize++;
              recursion();
          };
          recursion();
      } catch {
          postMessage({type: "send-recursion-stack-size",stackSize});
      }
  };
