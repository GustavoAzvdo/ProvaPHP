<?php

    require_once "Connecton.php";

    class ProdutosModel {
        private int $id;
        private string $nome;
        private float $valor;
        private int $estoque;
        private Database $con;

        public function __construct(int $id, string $nome, float $valor, int $estoque){
            $this->id = $id;
            $this->nome = $nome;
            $this->valor = valor;
            $this->estoque = $estoque;
            $this->con = Database::conectar();
        }

        public function getId(): int { return $this->id; }

        public function getNome(): string { return $this->nome; }

        public function getValor(): float { return $this->valor; }

        public function getEstoque(): int { return $this->estoque; }

        public function setNome(string $nome): void { $this->nome = $nome; }

        public function setValor(float $valor): void { $this->valor = $valor; }

        public function setEstoque(int $estoque): void { $this->estoque = $estoque; }


        public function salvar(): bool {
            try {
                $sql = "INSERT INTO produtos (nome, valor, estoque) VALUES (:nome, :valor, :estoque)";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":nome", $this->nome);
                $stmt->bindParam(":valor", $this->valor);
                $stmt->bindParam(":estoque", $this->estoque);

                if ($stmt->execute()) {
                    $this->id = (int)$this->con->lastInsertId();
                    return true;
                } else {
                    return false;
                }
            } catch (PDOException $e) {
                echo "Erro ao salvar produto: " . $e->getMessage();
                return false;
            }
        }

        public function buscarPorId(int $id): ?ProdutosModel {
            try {
                $sql = "SELECT * FROM produtos WHERE id = :id";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":id", $id);
                $stmt->execute();

                $dados = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($dados) {
                    return new ProdutosModel(
                        (int)$dados['id'],
                        $dados['nome'],
                        (float)$dados['valor'],
                        (int)$dados['estoque']
                    );
                } else {
                    return null;
                }
            } catch (PDOException $e) {
                echo "Erro ao buscar produto: " . $e->getMessage();
                return null;
            }
        }

        public function atualizar(): bool {
            try {
                $sql = "UPDATE produtos SET nome = :nome, valor = :valor, estoque = :estoque WHERE id = :id";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":nome", $this->nome);
                $stmt->bindParam(":valor", $this->valor);
                $stmt->bindParam(":estoque", $this->estoque);
                $stmt->bindParam(":id", $this->id);

                return $stmt->execute();
            } catch (PDOException $e) {
                echo "Erro ao atualizar produto: " . $e->getMessage();
                return false;
            }
        }

        public function deletar(): bool {
            try {
                $sql = "DELETE FROM produtos WHERE id = :id";
                $stmt = $this->con->prepare($sql);
                $stmt->bindParam(":id", $this->id);
                return $stmt->execute();
            } catch (PDOException $e) {
                echo "Erro ao deletar produto: " . $e->getMessage();
                return false;
            }
        }

        public static function buscarTodos(): array {
            try {
                $con = Database::conectar();
                $sql = "SELECT * FROM produtos";
                $stmt = $con->query($sql);
                $resultados = [];

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $produto = new ProdutosModel(
                        (int)$row['id'],
                        $row['nome'],
                        (float)$row['valor'],
                        (int)$row['estoque']
                    );
                    $resultados[] = $produto;
                }

                return $resultados;
            } catch (PDOException $e) {
                echo "Erro ao buscar produtos: " . $e->getMessage();
                return [];
            }
        }
    }
?>