<?php

    require_once __DIR__ . "/Connection.php";

    class VendasModels {
        private int $ID;
        private int $ID_produto;
        private int $quantidade;
        private float $valor_total;
        private string $data_venda;
        private PDO $con;
        public function __construct(int $ID, int $ID_produto, int $quantidade, float $valor_total, string $data_venda) {
            $this->ID = $ID;
            $this->ID_produto = $ID_produto;
            $this->quantidade = $quantidade;
            $this->valor_total = $valor_total;
            $this->data_venda = $data_venda;
            $this->con = Database::conectar();
        }

        public function getId(): int { return $this->ID; }
        public function getIdProduto(): int { return $this->ID_produto; }
        public function getQuantidade(): int { return $this->quantidade; }
        public function getValorTotal(): float { return $this->valor_total; }
        public function getDataVenda(): string { return $this->data_venda; }

        public function setIdProduto(int $ID_produto): void { $this->ID_produto = $ID_produto; }
        public function setQuantidade(int $quantidade): void { $this->quantidade = $quantidade; }
        public function setValorTotal(float $valor_total): void { $this->valor_total = $valor_total; }
        public function setDataVenda(string $data_venda): void { $this->data_venda = $data_venda; }

        public function salvar(): bool {
            try {
                $sql = "INSERT INTO vendas (ID_produto, quantidade, valor_total, data_venda)
                        VALUES (:ID_produto, :quantidade, :valor_total, :data_venda)";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":ID_produto", $this->ID_produto);
                $stmt->bindParam(":quantidade", $this->quantidade);
                $stmt->bindParam(":valor_total", $this->valor_total);
                $stmt->bindParam(":data_venda", $this->data_venda);

                if ($stmt->execute()) {
                    $this->ID = (int)$this->con->lastInsertId();
                    return true;
                }

                return false;
            } catch (PDOException $e) {
                echo "Erro ao salvar venda: " . $e->getMessage();
                return false;
            }
        }

        public function buscarPorId(int $ID): ?VendasModels {
            try {
                $sql = "SELECT * FROM vendas WHERE ID = :ID";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":ID", $ID);
                $stmt->execute();

                $dados = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($dados) {
                    return new VendasModels(
                        (int)$dados['ID'],
                        (int)$dados['ID_produto'],
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
                        SET ID_produto = :ID_produto, quantidade = :quantidade, valor_total = :valor_total, data_venda = :data_venda 
                        WHERE ID = :ID";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":ID_produto", $this->ID_produto);
                $stmt->bindParam(":quantidade", $this->quantidade);
                $stmt->bindParam(":valor_total", $this->valor_total);
                $stmt->bindParam(":data_venda", $this->data_venda);
                $stmt->bindParam(":ID", $this->ID);

                return $stmt->execute();
            } catch (PDOException $e) {
                echo "Erro ao atualizar venda: " . $e->getMessage();
                return false;
            }
        }

        public function deletar(): bool {
            try {
                $sql = "DELETE FROM vendas WHERE ID = :ID";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":ID", $this->ID);

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
                        (int)$row['ID'],
                        (int)$row['ID_produto'],
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