<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

require_once __DIR__ . '/../Model/VendasModel.php';
require_once __DIR__ . '/../Model/ProdutosModel.php';
require_once __DIR__ . '/../Model/Connection.php';
$method = $_SERVER['REQUEST_METHOD'];
$ID = $_GET['ID'] ?? null;

switch ($method) {
    case 'GET':
        if ($ID !== null) {
            $venda = (new VendasModels(0, 0, 0, 0.0, ''))->buscarPorId((int)$ID);
            if ($venda) {
                echo json_encode([
                    'ID' => $venda->getId(),
                    'ID_produto' => $venda->getIdProduto(),
                    'quantidade' => $venda->getQuantidade(),
                    'valor_total' => $venda->getValorTotal(),
                    'data_venda' => $venda->getDataVenda()
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['mensagem' => 'Venda não encontrada.']);
            }
        } else {
            $vendas = VendasModels::buscarTodos();
            $resultado = [];

            foreach ($vendas as $v) {
                $resultado[] = [
                    'ID' => $v->getId(),
                    'ID_produto' => $v->getIdProduto(),
                    'quantidade' => $v->getQuantidade(),
                    'valor_total' => $v->getValorTotal(),
                    'data_venda' => $v->getDataVenda()
                ];
            }

            echo json_encode($resultado);
        }
        break;

    case 'POST': 
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['ID_produto'], $input['quantidade'], $input['valor_total'], $input['data_venda'])) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Dados da venda incompletos.']);
            exit;
        }

        $pdo = Database::conectar();
        $pdo->beginTransaction(); 

        try {
            $idProduto = (int)$input['ID_produto'];
            $quantidadeVendida = (int)$input['quantidade'];
            $produto = ProdutosModel::buscarPorId($idProduto);

            if (!$produto) {
                throw new Exception("Produto não encontrado.");
            }
            if ($produto->getEstoque() < $quantidadeVendida) {
                throw new Exception("Estoque insuficiente.");
            }

            $novoEstoque = $produto->getEstoque() - $quantidadeVendida;
            $produto->setEstoque($novoEstoque);
            $produto->atualizar(); 


            $venda = new VendasModels(
                0,
                $idProduto,
                $quantidadeVendida,
                (float)$input['valor_total'],
                $input['data_venda']
            );
            $venda->salvar();
            $pdo->commit();

            http_response_code(201);
            echo json_encode([
                'mensagem' => 'Venda registrada e estoque atualizado!',
                'ID' => $venda->getId()
            ]);
        } catch (Exception $e) {
         
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao processar venda: ' . $e->getMessage()]);
        }
        break;
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['ID_produto'], $input['quantidade'], $input['valor_total'], $input['data_venda'])) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'Dados incompletos.']);
            exit;
        }

        $venda = new VendasModels(
            0,
            (int)$input['ID_produto'],
            (int)$input['quantidade'],
            (float)$input['valor_total'],
            $input['data_venda']
        );

        if ($venda->salvar()) {
            http_response_code(201);
            echo json_encode([
                'mensagem' => 'Venda registrada com sucesso.',
                'id' => $venda->getId()
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['mensagem' => 'Erro ao registrar venda.']);
        }
        break;

    case 'DELETE':
        if ($ID === null) {
            http_response_code(400);
            echo json_encode(['mensagem' => 'ID não fornecido.']);
            exit;
        }

        $venda = (new VendasModels(0, 0, 0, 0.0, ''))->buscarPorId((int)$ID);

        if ($venda && $venda->deletar()) {
            echo json_encode(['mensagem' => 'Venda deletada com sucesso.']);
        } else {
            http_response_code(404);
            echo json_encode(['mensagem' => 'Venda não encontrada ou erro ao deletar.']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['mensagem' => 'Método não permitido.']);
        break;
}
