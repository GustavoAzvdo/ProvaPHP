<?php

require_once  __DIR__ . '/Connection.php';

class ProdutosModel
{
    private int $ID;
    private string $nome;
    private float $valor;
    private int $estoque;
    private PDO $con;

    public function __construct(int $ID, string $nome, float $valor, int $estoque)
    {
        $this->ID = $ID;
        $this->nome = $nome;
        $this->valor = $valor;
        $this->estoque = $estoque;
       
    }

    public function getId(): int
    {
        return $this->ID;
    }

    public function getNome(): string
    {
        return $this->nome;
    }

    public function getValor(): float
    {
        return $this->valor;
    }

    public function getEstoque(): int
    {
        return $this->estoque;
    }

    public function setNome(string $nome): void
    {
        $this->nome = $nome;
    }

    public function setValor(float $valor): void
    {
        $this->valor = $valor;
    }

    public function setEstoque(int $estoque): void
    {
        $this->estoque = $estoque;
    }


    public function salvar(): bool
    {
        try {
            $this->con = Database::conectar();
            $sql = "INSERT INTO produtos (nome, valor, estoque) VALUES (:nome, :valor, :estoque)";
            $stmt = $this->con->prepare($sql);
            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":valor", $this->valor);
            $stmt->bindParam(":estoque", $this->estoque);

            if ($stmt->execute()) {
                $this->ID = (int)$this->con->lastInsertId();
                return true;
            } else {
                return false;
            }
        } catch (PDOException $e) {
            echo "Erro ao salvar produto: " . $e->getMessage();
            return false;
        }
    }

    public static function buscarPorId(int $ID): ?ProdutosModel
    {
        try {
            $con = Database::conectar(); // Pega a conexão aqui dentro
            $sql = "SELECT * FROM produtos WHERE ID = :ID";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(":id", $ID);
            $stmt->execute();
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($dados) {
              
                return new self(
                    (int)$dados['ID'],
                    $dados['nome'],
                    (float)$dados['valor'],
                    (int)$dados['estoque']
                );
            }
            return null;
        } catch (PDOException $e) {
            error_log("Erro ao buscar produto por ID: " . $e->getMessage()); 
            return null;
        }
    }

    public function atualizar(): bool
    {
        try {
            $sql = "UPDATE produtos SET nome = :nome, valor = :valor, estoque = :estoque WHERE ID = :ID";
            $stmt = $this->con->prepare($sql);
            $stmt->bindParam(":nome", $this->nome);
            $stmt->bindParam(":valor", $this->valor);
            $stmt->bindParam(":estoque", $this->estoque);
            $stmt->bindParam(":id", $this->ID);

            return $stmt->execute();
        } catch (PDOException $e) {
            echo "Erro ao atualizar produto: " . $e->getMessage();
            return false;
        }
    }

    public function deletar(): bool
    {
        try {
            $sql = "DELETE FROM produtos WHERE ID = :ID";
            $stmt = $this->con->prepare($sql);
            $stmt->bindParam(":id", $this->ID);
            return $stmt->execute();
        } catch (PDOException $e) {
            echo "Erro ao deletar produto: " . $e->getMessage();
            return false;
        }
    }

    public static function buscarTodos(): array
    {
        try {
            $con = Database::conectar();
            $sql = "SELECT * FROM produtos";
            $stmt = $con->query($sql);
            $resultados = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $produto = new ProdutosModel(
                    (int)$row['ID'],
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
