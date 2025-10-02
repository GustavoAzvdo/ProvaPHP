<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit();
    }

    require_once __DIR__ . '/../Model/VendasModel.php';

    $method = $_SERVER['REQUEST_METHOD'];
    $id = $_GET['id'] ?? null;

    switch ($method) {
        case 'GET':
            if ($id !== null) {
                $venda = (new VendasModels(0, 0, 0, 0.0, ''))->buscarPorId((int)$id);
                if ($venda) {
                    echo json_encode([
                        'id' => $venda->getId(),
                        'id_produto' => $venda->getIdProduto(),
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
                        'id' => $v->getId(),
                        'id_produto' => $v->getIdProduto(),
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

            if (!isset($input['id_produto'], $input['quantidade'], $input['valor_total'], $input['data_venda'])) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'Dados incompletos.']);
                exit;
            }

            $venda = new VendasModels(
                0,
                (int)$input['id_produto'],
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
            if ($id === null) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'ID não fornecido.']);
                exit;
            }

            $venda = (new VendasModels(0, 0, 0, 0.0, ''))->buscarPorId((int)$id);

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
?>