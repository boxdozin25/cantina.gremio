import React from "react";

export default function CantinaSystem() {
  const [clientes, setClientes] = React.useState([]);
  const [nome, setNome] = React.useState("");
  const [produto, setProduto] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [quantidade, setQuantidade] = React.useState(1);
  const [historico, setHistorico] = React.useState([]);

  const produtos = [
    { nome: "BARRA CHOCOLATE", valor: 9.00 },
  { nome: "BISCOITO", valor: 3.50 },
  { nome: "BOLO DE POTE", valor: 4.50 },
  { nome: "REFRIGERANTE LATA", valor: 4.50 },
  { nome: "COCA LATA", valor: 5.00 },
  { nome: "REFRIGERANTE 1L", valor: 7.50 },
  { nome: "REFRIGERANTE 2L", valor: 12.00 },
  { nome: "GATORADE", valor: 9.00 },
  { nome: "ENERGÉTICO", valor: 10.00 },
  { nome: "MICOS", valor: 2.50 },
  { nome: "ANELITOS", valor: 3.00 },
  { nome: "BATATA CRONY", valor: 3.50 },
  { nome: "PAÇOCA", valor: 1.00 },
  { nome: "TODDYNHO", valor: 3.00 },
  { nome: "SALGADO", valor: 3.00 },
  { nome: "CHOP", valor: 3.00 },
  { nome: "PUDIM", valor: 6.00 },
  { nome: "SONHO DE VALSA", valor: 2.00 },
  { nome: "PÉ-DE-MOLEQUE", valor: 1.00 },
  { nome: "TIP-TOP", valor: 0.75 },
  { nome: "JUJUBA", valor: 1.50 },
  { nome: "ÁGUA", valor: 2.00 },
  { nome: "CREMOSINHO", valor: 1.50 },
  { nome: "MONSTER", valor: 12.00 },
  { nome: "CHOCOLATE BATOM", valor: 2.50 },
  { nome: "PETÍCITOS", valor: 3.00 },
  { nome: "EMPADÃO", valor: 10.00 },
  { nome: "EMPADA", valor: 8.00 },
  { nome: "SUCO", valor: 5.00 },
  { nome: "SANDUICHE", valor: 4.00 },
  ];

  const totalArrecadado = historico.reduce(
    (total, item) => total + item.valor,
    0
  );

  React.useEffect(() => {
    const clientesSalvos = localStorage.getItem("clientesCantina");
    const historicoSalvo = localStorage.getItem("historicoCantina");

    if (clientesSalvos) {
      setClientes(JSON.parse(clientesSalvos));
    }

    if (historicoSalvo) {
      setHistorico(JSON.parse(historicoSalvo));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(
      "clientesCantina",
      JSON.stringify(clientes)
    );
  }, [clientes]);

  React.useEffect(() => {
    localStorage.setItem(
      "historicoCantina",
      JSON.stringify(historico)
    );
  }, [historico]);

  function adicionarCompra() {
    if (!nome || !produto || !valor) {
      alert("Preencha todos os campos.");
      return;
    }

    const novaCompra = {
      id: Date.now(),
      nome,
      produto,
      valor: parseFloat(valor) * quantidade,
      quantidade,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    setHistorico([novaCompra, ...historico]);

    const clienteExistente = clientes.find(
      (c) => c.nome === nome
    );

    if (clienteExistente) {
      setClientes(
        clientes.map((c) =>
          c.nome === nome
            ? {
                ...c,
                total: c.total + parseFloat(valor) * quantidade,
              }
            : c
        )
      );
    } else {
      setClientes([
        ...clientes,
        {
          nome,
          total: parseFloat(valor) * quantidade,
        },
      ]);
    }

    setNome("");
    setProduto("");
    setValor("");
    setQuantidade(1);
  }

  function quitarDivida(nomeCliente) {
    setClientes(
      clientes.map((c) =>
        c.nome === nomeCliente
          ? { ...c, total: 0 }
          : c
      )
    );
  }

  function editarDivida(nomeCliente) {
    const novoValor = prompt(
      "Digite o novo valor da dívida:"
    );

    if (novoValor === null) return;

    const valorConvertido = parseFloat(novoValor);

    if (isNaN(valorConvertido) || valorConvertido < 0) {
      alert("Digite um valor válido.");
      return;
    }

    setClientes(
      clientes.map((c) =>
        c.nome === nomeCliente
          ? { ...c, total: valorConvertido }
          : c
      )
    );
  }

  function gerarRelatorio() {
    const conteudo = clientes
      .map(
        (cliente) =>
          `${cliente.nome} - Dívida: R$ ${cliente.total.toFixed(2)}`
      )
      .join("\n");

    const blob = new Blob([conteudo], {
      type: "text/plain;charset=utf-8",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio-cantina.txt";
    link.click();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Sistema da Cantina do Grêmio
        </h1>

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Registrar Compra
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nome da pessoa"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="border rounded-xl p-3"
            />

            <select
              value={produto}
              onChange={(e) => {
                const produtoSelecionado = produtos.find(
                  (p) => p.nome === e.target.value
                );

                setProduto(e.target.value);

                if (produtoSelecionado) {
                  setValor(produtoSelecionado.valor);
                }
              }}
              className="border rounded-xl p-3"
            >
              <option value="">
                Selecione o produto
              </option>

              {produtos.map((p, index) => (
                <option key={index} value={p.nome}>
                  {p.nome} - R$ {p.valor}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantidade"
              value={quantidade}
              min="1"
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="border rounded-xl p-3"
            />

            <input
              type="number"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="border rounded-xl p-3"
            />

            <button
              onClick={adicionarCompra}
              className="bg-black text-white rounded-xl p-3 hover:opacity-90"
            >
              Adicionar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 text-center">
          <button
            onClick={gerarRelatorio}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl mb-6 hover:opacity-90"
          >
            Baixar Relatório
          </button>

          <h2 className="text-2xl font-semibold mb-2">
            Total Arrecadado
          </h2>

          <p className="text-4xl font-bold text-green-600">
            R$ {totalArrecadado.toFixed(2)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Pessoas Devendo
            </h2>

            <div className="space-y-4">
              {clientes.length === 0 && (
                <p className="text-gray-500">
                  Nenhuma dívida registrada.
                </p>
              )}

              {clientes.map((cliente, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {cliente.nome}
                    </p>

                    <p className="text-gray-600">
                      Deve: R$ {cliente.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editarDivida(cliente.nome)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => quitarDivida(cliente.nome)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl"
                    >
                      Pago
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Histórico de Compras
            </h2>

            <div className="space-y-3 max-h-[500px] overflow-auto">
              {historico.length === 0 && (
                <p className="text-gray-500">
                  Nenhuma compra registrada.
                </p>
              )}

              {historico.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-2xl p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">
                        {item.nome}
                      </p>

                      <p className="text-gray-600">
                        {item.produto} x{item.quantidade}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">
                        R$ {item.valor.toFixed(2)}
                      </p>

                      <p className="text-sm text-gray-500">
                        {item.data}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
