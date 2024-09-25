import { useState } from "react";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

interface moduleFunction {
  name: string;
  visibility: string;
  is_entry: boolean;
  is_view: boolean;
  generic_type_params: any[];
  params: string[];
  return: any[];
}

function App() {
  const [accountAddress, setAccountAddress] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [moduleFunctions, setModuleFunctions] = useState<moduleFunction[]>([]);
  const apiHost = "https://api.mainnet.aptoslabs.com/v1";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = `${apiHost}/accounts/${accountAddress}/modules`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setModules(data);
        } else {
          console.log("Response is not a list");
        }
      })
      .catch((error) => {
        console.error("Error fetching modules:", error);
      });
  };

  const getModuleFunctions = (module: any) => {
    console.log(module);
    for (let i = 0; i < modules.length; i++) {
      if (modules[i].abi.name === module) {
        setModuleFunctions(modules[i].abi.exposed_functions);
        break;
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <WalletSelector />
      <p className="text-xl">Find your module</p>
      <form
        className="mt-4  w-full flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          id="accountAddress"
          name="accountAddress"
          className="px-2 py-1 w-2/5 text-gray-900 border-r-0 border-2 rounded-l-lg bg-gray-50 text-base focus:ring-blue-100 focus:border-blue-100"
          placeholder="Enter account address"
          value={accountAddress}
          onChange={(e) => setAccountAddress(e.target.value)}
        />
        <button
          type="submit"
          className="border-2 border-l-0 py-1 px-2 rounded-r-lg"
        >
          🔍
        </button>
      </form>
      {modules.length > 0 && (
        <select
          className="border rounded px-2 py-1 my-4 bg-white"
          onChange={(e) => getModuleFunctions(e.target.value)}
        >
          <option value="">Choose account's module</option>
          {modules.map((module, index) => (
            <option key={index} value={module.abi.name}>
              {module.abi.name}
            </option>
          ))}
        </select>
      )}
      <div className="ml-4 grid grid-cols-3 gap-4">
        {moduleFunctions.map((func, index) => (
          <div key={index} className="border rounded p-4 shadow-md">
            <p className="font-bold text-sm mb-2">{func.name}</p>
            <p className="text-sm text-gray-600 mb-2">
              Type: {func.visibility}
            </p>
            <p className="text-sm mb-1">Params: {func.params.join(", ")}</p>
            <p className="text-sm mb-1">Returns: {func.return.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
