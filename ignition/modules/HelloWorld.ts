import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HelloWorldModule = buildModule("HelloWorldModule", (m) => {
  const HelloWorld = m.contract("HelloWorld");

  return { HelloWorld };
});

export default HelloWorldModule;
