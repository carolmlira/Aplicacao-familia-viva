0
menu = """

[1]Lavagem
[2]Limpeza interna
[3]Lavagem e limpeza interna
[q]Sair

=> """

from datetime import datetime, timedelta

tempo_pequeno = 30
tempo_medio = 45
tempo_grande = 60
data_atual = datetime.now()

while True:
   opcao = input(menu)

   if opcao == "1":
      tipo_carro = input("Informe o tipo do seu carro:  ")

      if tipo_carro == "p":
         data_estimada = data_atual + timedelta(minutes= tempo_pequeno)
         print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada}')

      elif tipo_carro == "m":
         data_estimada = data_atual + timedelta(minutes = tempo_medio)
         print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada}')

      elif tipo_carro == "g":
         data_estimada = data_atual + timedelta(minutes= tempo_grande)
         print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada}')

      else:
          print("Operação falhou! Informe o tipo de carro válido.")


   elif opcao == "2":
        tipo_carro = input("Informe o tipo do seu carro:  ")
        
        
        if tipo_carro == "p":
         data_estimada = data_atual + timedelta(minutes= tempo_pequeno)
         print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada}')

        elif tipo_carro == "m":
         data_estimada = data_atual + timedelta(minutes = tempo_medio)
         print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada}')

        elif tipo_carro == "g":
         data_estimada = data_atual + timedelta(minutes= tempo_grande)
         print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada}')
        
        else:
          print("Operação falhou! Informe o tipo de carro válido.")

   elif opcao == "3":
      tipo_carro = input("Informe o tipo do seu carro:  ")


      if tipo_carro == "p":
       data_estimada = data_atual + timedelta(minutes= tempo_pequeno*2)
       print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada} ')


      elif tipo_carro == "m":
       data_estimada = data_atual + timedelta(minutes= tempo_medio*2)
       print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada} ')

      elif tipo_carro == "g":
       data_estimada = data_atual + timedelta(minutes= tempo_grande*2)
       print(f'A hora de entrada do seu carro é {data_atual}, seu carro ficará pronto em {data_estimada} ')

      else:
          print("Operação falhou! Informe o tipo de carro válido.")

   elif opcao == "q":
       break
   
   else:
       print("Operação inválida, por favor selecione novamente a operação desejada")
