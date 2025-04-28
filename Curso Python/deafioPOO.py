class Bicicleta:
    def __init__(self, cor, modelo, ano, valor) :
        self.cor = cor
        self.modelo = modelo
        self.ano = ano
        self.valor = valor #Atributos da classe
    
    def buzinar(self): #Métodos
        print("Bi, Bi..")
    
    def parar(self):
        print("Parando a bicicleta")
        print("Bicicleta parada")
    
    def correr(self):
        print("Vrummmmm...")

#Representação de classes   
def __str__(self):
    return f"{self.__class__.__name__}: {', '.join([f'{chave}={valor}' for chave, valor in self.__dict__.items()])}"

mod1 = Bicicleta("vermelho", "caloi", 2020, 600)
mod1.buzinar()
mod1.parar()
mod1.correr()

mod2 = Bicicleta("verde", "monark", 2020, 190)
Bicicleta.buzinar(mod2)

def __str__(self):
    return f"{self.__class__.__name__}: {', '.join([f'{chave}={valor}' for chave, valor in self.__dict__.items()])}"