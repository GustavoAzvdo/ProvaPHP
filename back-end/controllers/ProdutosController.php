<?php

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit();
    }

    require_once __DIR__ . '/../Model/ProdutosModel.php';

    $method = $_SERVER['REQUEST_METHOD'];
    $ID = $_GET['ID'] ?? null;

    switch ($method) {
        case 'GET':
            if ($ID !== null) {
                $produto = (new ProdutosModel(0, '', 0.0, 0))->buscarPorId((int)$ID);
                if ($produto) {
                    echo json_encode([
                        'ID' => $produto->getId(),
                        'nome' => $produto->getNome(),
                        'valor' => $produto->getValor(),
                        'estoque' => $produto->getEstoque()
                    ]);
                } else {
                    http_response_code(404);
                    echo json_encode(['mensagem' => 'Produto não encontrado.']);
                }
            } else {
                $produtos = ProdutosModel::buscarTodos();
                $resultado = [];

                foreach ($produtos as $p) {
                    $resultado[] = [
                        'ID' => $p->getId(),
                        'nome' => $p->getNome(),
                        'valor' => $p->getValor(),
                        'estoque' => $p->getEstoque()
                    ];
                }

                echo json_encode($resultado);
            }
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['nome'], $input['valor'], $input['estoque'])) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'Dados incompletos.']);
                exit;
            }

            $produto = new ProdutosModel(0, $input['nome'], (float)$input['valor'], (int)$input['estoque']);

            if ($produto->salvar()) {
                http_response_code(201);
                echo json_encode([
                    'mensagem' => 'Produto criado com sucesso.',
                    'ID' => $produto->getId()
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['mensagem' => 'Erro ao criar produto.']);
            }
            break;

        case 'DELETE':
            if ($ID === null) {
                http_response_code(400);
                echo json_encode(['mensagem' => 'ID não fornecido.']);
                exit;
            }

            $produto = (new ProdutosModel(0, '', 0.0, 0))->buscarPorId((int)$ID);

            if ($produto && $produto->deletar()) {
                echo json_encode(['mensagem' => 'Produto deletado com sucesso.']);
            } else {
                http_response_code(404);
                echo json_encode(['mensagem' => 'Produto não encontrado ou erro ao deletar.']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['mensagem' => 'Método não permitido.']);
            break;
    }

?>