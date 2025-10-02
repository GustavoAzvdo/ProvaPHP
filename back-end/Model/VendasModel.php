<?php

    require_once __DIR__ . "Connection.php";

    class VendasModels {
        private int $id;
        private int $id_produto;
        private int $quantidade;
        private float $valor_total;
        private string $data_venda;
        private PDO $con;
        public function __construct(int $id, int $id_produto, int $quantidade, float $valor_total, string $data_venda) {
            $this->id = $id;
            $this->id_produto = $id_produto;
            $this->quantidade = $quantidade;
            $this->valor_total = $valor_total;
            $this->data_venda = $data_venda;
            $this->con = Database::conectar();
        }

        public function getId(): int { return $this->id; }
        public function getIdProduto(): int { return $this->id_produto; }
        public function getQuantidade(): int { return $this->quantidade; }
        public function getValorTotal(): float { return $this->valor_total; }
        public function getDataVenda(): string { return $this->data_venda; }

        public function setIdProduto(int $id_produto): void { $this->id_produto = $id_produto; }
        public function setQuantidade(int $quantidade): void { $this->quantidade = $quantidade; }
        public function setValorTotal(float $valor_total): void { $this->valor_total = $valor_total; }
        public function setDataVenda(string $data_venda): void { $this->data_venda = $data_venda; }

        public function salvar(): bool {
            try {
                $sql = "INSERT INTO vendas (id_produto, quantidade, valor_total, data_venda)
                        VALUES (:id_produto, :quantidade, :valor_total, :data_venda)";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":id_produto", $this->id_produto);
                $stmt->bindParam(":quantidade", $this->quantidade);
                $stmt->bindParam(":valor_total", $this->valor_total);
                $stmt->bindParam(":data_venda", $this->data_venda);

                if ($stmt->execute()) {
                    $this->id = (int)$this->con->lastInsertId();
                    return true;
                }

                return false;
            } catch (PDOException $e) {
                echo "Erro ao salvar venda: " . $e->getMessage();
                return false;
            }
        }

        public function buscarPorId(int $id): ?VendasModels {
            try {
                $sql = "SELECT * FROM vendas WHERE id = :id";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":id", $id);
                $stmt->execute();

                $dados = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($dados) {
                    return new VendasModels(
                        (int)$dados['id'],
                        (int)$dados['id_produto'],
                        (int)$dados['quantidade'],
                        (float)$dados['valor_total'],
                        $dados['data_venda']
                    );
                }

                return null;
            } catch (PDOException $e) {
                echo "Erro ao buscar venda: " . $e->getMessage();
                return null;
            }
        }

        public function atualizar(): bool {
            try {
                $sql = "UPDATE vendas 
                        SET id_produto = :id_produto, quantidade = :quantidade, valor_total = :valor_total, data_venda = :data_venda 
                        WHERE id = :id";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":id_produto", $this->id_produto);
                $stmt->bindParam(":quantidade", $this->quantidade);
                $stmt->bindParam(":valor_total", $this->valor_total);
                $stmt->bindParam(":data_venda", $this->data_venda);
                $stmt->bindParam(":id", $this->id);

                return $stmt->execute();
            } catch (PDOException $e) {
                echo "Erro ao atualizar venda: " . $e->getMessage();
                return false;
            }
        }

        public function deletar(): bool {
            try {
                $sql = "DELETE FROM vendas WHERE id = :id";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":id", $this->id);

                return $stmt->execute();
            } catch (PDOException $e) {
                echo "Erro ao deletar venda: " . $e->getMessage();
                return false;
            }
        }

        public static function buscarTodos(): array {
            try {
                $con = Database::conectar();
                $sql = "SELECT * FROM vendas";
                $stmt = $con->query($sql);

                $vendas = [];

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $venda = new VendasModels(
                        (int)$row['id'],
                        (int)$row['id_produto'],
                        (int)$row['quantidade'],
                        (float)$row['valor_total'],
                        $row['data_venda']
                    );
                    $vendas[] = $venda;
                }

                return $vendas;
            } catch (PDOException $e) {
                echo "Erro ao buscar vendas: " . $e->getMessage();
                return [];
            }
        }

    }

?>