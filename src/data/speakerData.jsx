import alvaro from "../assets/speakersBanner/alvaro.png";
import americo from "../assets/speakersBanner/americo.png";
import britto from "../assets/speakersBanner/britto.png";
import freitas from "../assets/speakersBanner/freitas.png";
import heller from "../assets/speakersBanner/heller.png";
import luna from "../assets/speakersBanner/luna.png";
import bueno from "../assets/speakersBanner/bueno.png";
import mituuti from "../assets/speakersBanner/mituuti.png";
import pompeu from "../assets/speakersBanner/pompeu.png";
import siegel from "../assets/speakersBanner/siegel.png";
import souza from "../assets/speakersBanner/souza.png";
import chemin from "../assets/speakersBanner/chemin.png";
import seiti from "../assets/speakersBanner/seiti.png";
import horacio from "../assets/speakersBanner/horacio.png";
import peterson from "../assets/speakersBanner/peterson.png";
import savastano from "../assets/speakersBanner/savastano.png";
import corradi from "../assets/speakersBanner/corradi.png";
import gene from "../assets/speakersBanner/gene.png";
import gabriel from "../assets/speakersBanner/gabriel.png";
import fabio from "../assets/speakersBanner/fabio.png";
import guarizo from "../assets/speakersBanner/guarizo.png";
import oliveira from "../assets/speakersBanner/oliveira.png";
import sparhawk from "../assets/speakersBanner/sparhawk.png";
import eduardo from "../assets/speakersBanner/eduardo.png";
import barrera from "../assets/speakersBanner/barrera.png";

import alvaroFace from "../assets/speakers/alvaro.jpeg";
import americoFace from "../assets/speakers/americo.jpeg";
import brittoFace from "../assets/speakers/britto.jpeg";
import freitasFace from "../assets/speakers/freitas.jpeg";
import hellerFace from "../assets/speakers/heller.jpeg";
import lunaFace from "../assets/speakers/luna.jpeg";
import buenoFace from "../assets/speakers/bueno.jpeg";
import mituutiFace from "../assets/speakers/mituuti.jpeg";
import pompeuFace from "../assets/speakers/pompeu.jpeg";
import siegelFace from "../assets/speakers/siegel.jpeg";
import souzaFace from "../assets/speakers/souza.jpeg";
import cheminFace from "../assets/speakers/chemin.jpeg";
import seitiFace from "../assets/speakers/seiti.jpeg";
import horacioFace from "../assets/speakers/horacio.jpeg";
import petersonFace from "../assets/speakers/peterson.jpeg";
import savastanoFace from "../assets/speakers/savastano.jpeg";
import corradiFace from "../assets/speakers/corradi.jpeg";
import geneFace from "../assets/speakers/gene.jpeg";
import fabioFace from "../assets/speakers/fabio.jpeg";
import guarizoFace from "../assets/speakers/guarizo.jpeg";
import oliveiraFace from "../assets/speakers/oliveira.jpeg";
import gabrielFace from "../assets/speakers/gabriel.jpeg";
import sparhawkFace from "../assets/speakers/sparhawk.jpeg";
import eduardoFace from "../assets/speakers/eduardo.jpeg";
import barreraFace from "../assets/speakers/barrera.jpeg";

import { companyLogos } from "../constants/index";
import { companyLogos2 } from "../constants/index";
import nxplogo from "../assets/nxplogo.jpg";

// Função para transformar pontos em quebras de linha para parágrafos
const formatDescription = (text) => {
  if (!text) return "";
  // Substitui os pontos finais seguidos de espaço por ponto final + quebra de linha
  return text.replace(/\.\s+/g, ".\n\n");
};

const getCompanyInfo = (title) => {
  // Busca primeiro em companyLogos
  let company = companyLogos.find((item) => item.title === title);

  // Se não encontrar, busca em companyLogos2
  if (!company) {
    company = companyLogos2.find((item) => item.title === title);
  }

  return {
    companyLogo: company?.logo || "", // Retorna logo ou string vazia se não encontrado
    companyUrl: company?.url || "", // Retorna URL ou string vazia se não encontrado
  };
};

export const horariosEvento = [
  { id: "1", label: "09:00 às 10:00" },
  { id: "2", label: "10:10 às 11:10" },
  { id: "3", label: "11:20 às 12:20" },
  { id: "4", label: "14:00 às 15:00" },
  { id: "5", label: "15:10 às 16:10" },
  { id: "6", label: "17:00 às 18:00" },
];

export const events = [
  {
    id: 1,
    palestrante: "Álvaro Branco",
    position: "Engenheiro de Aplicação de Campo",
    descriptionBanner: formatDescription(
      "Formado e em Engenharia Elétrica pela Faculdade de Engenharia Mauá, com MBA Executivo e Pós-graduado em AI & ML. Mais de 25 anos de experiência no mercado, destes mais de 20 anos de experiência com desenvolvimento de hardware e software. Atuando nos mais diversos seguimentos da eletrônica tanto como desenvolvedor quanto suporte técnico. Há dois anos ingressei ao time da Infineon Technologies como FAE suportando os clientes da América do Sul"
    ),
    imageBanner: alvaro,
    linkedinUrl: "https://linkedin.com/in/alvaro-pinho-branco-16b2041b",
    title: "Desmistificando Aplicações com GaN, SiC e Si! \n \n \n ",
    descriptionLecture: formatDescription(
      "Desvende toda as caracteriscas de cada tecnologia e decubra aonde podem ser aplicadas "
    ),
    hour: "1",
    room: "São Lourenço",
    image: alvaroFace,
    ...getCompanyInfo("Infineon"), // Adicionamos a URL aqui
  },
  {
    id: 2,
    palestrante: "Américo Paulicchi",
    position: "Engenheiro Sênior de Design Conceitual",
    descriptionBanner: formatDescription(
      "Américo ingressou na Littelfuse ESBU Vendas Regionais Sul da Europa em 1º de agosto de 2022, como Engenheiro de Aplicação de Campo para Brasil e América do Sul, reportando-se a Tim Elliott. Ele suporta os negócios da Littelfuse em tecnologias ESBU através de distribuição e OEM direto, focando no desenvolvimento de novos negócios para aumentar a receita. Américo estudou Engenharia Elétrica na FESP, com especialização em Eletrônica, Ele tem uma forte experiência em semicondutores de potência, iniciando sua carreira em P&D na PHILIPS do BRASIL em 1978. Ocupou vários cargos na indústria de semicondutores, contribuindo para um crescimento significativo nas vendas e desenvolvendo soluções para grandes empresas e projetos."
    ),
    imageBanner: americo,
    linkedinUrl: "https://linkedin.com/in/américo-paulicchi-filho-b118ab1",
    title:
      "Soluções Multi tecnologia em SiC e encapsulamentos isolados avançados \n \n ",
    descriptionLecture: formatDescription(
      "Participe da nossa palestra sobre a nova linha de produtos de Silicon Carbide (SiC) da Littelfuse. Descubra como essa tecnologia revolucionária permite aumentar as frequências de chaveamento com menores perdas por condução e chaveamento. Saiba como isso resulta na redução do tamanho dos dissipadores de alumínio, das placas de circuito impresso e dos indutores em projetos de conversores DC/DC, AC/DC e DC/AC, utilizando diversas topologias de conversão."
    ),
    hour: "1",
    room: "São Lourenço",
    image: americoFace,
    ...getCompanyInfo("Littelfuse"),
  },
  {
    id: 3,
    palestrante: "André Heller",
    position: "Gerente Nacional de Vendas",
    descriptionBanner: formatDescription(
      "Engenheiro Eletrônico com 22 anos de experiência no mercado. Há 12 anos atuando na gestão de vendas de componentes eletrônicos no Brasil, oferecendo total suporte em componentes eletrônicos e suas aplicações, e na cadeia de suprimentos como um todo."
    ),
    imageBanner: heller,
    linkedinUrl: "https://linkedin.com/in/andre-heller-51004545",
    title: "Perdas de Potência e Desempenho de Comutação em MOSFETs \n \n",
    descriptionLecture: formatDescription(
      "As perdas de potência em um circuito se traduzem em calor e perda de eficiência. Elas são críticas em MOSFETs de Potência para garantir a operação dentro de uma faixa de temperatura segura e a confiabilidade do produto. Neste seminário, abordaremos as perdas por condução e comutação no MOSFET, com expressões analíticas e métodos para calcular e estimar a dissipação de calor causada tanto pela condução quanto pela comutação."
    ),
    hour: "1",
    room: "São Lourenço",
    image: hellerFace,
    ...getCompanyInfo("MCC Semiconductor"),
  },
  {
    id: 4,
    palestrante: "André Oliveira",
    position: "Engenheiro de Projeto de Sistemas",
    descriptionBanner: formatDescription(
      "André Oliveira possui graduação em Engenharia Elétrica pela UNESP e conta com mais de 18 anos de experiência na Renesas. Como especialista em desenvolvimento de firmware, André aprimorou suas habilidades trabalhando com líderes do setor como Renesas, Freescale e Microchip. Sua extensa expertise e dedicação o tornam um profissional valioso no campo de sistemas embarcados."
    ),
    imageBanner: oliveira,
    linkedinUrl: "https://www.linkedin.com/in/andr%C3%A9-oliveira-39589514/",
    title:
      "Como a Renesas Pode Acelerar Projetos de AIoT: Visão, Voz e Análises em Tempo Real \n \n",
    descriptionLecture: formatDescription(
      "Apresentação das principais novidades de produtos para o mercado de iluminação externa, explorando soluções e tendências do mercado, bem como introduzir uma visão geral das aplicações dos produtos desde chicotes especiais até o fornecimento de sistemas completos. Alguns dos principais produtos de nosso portifólio contemplam soluções técnicas como a família LUMiNAWISE, conectores CPC, soluções para iluminação de agricultura e cidades inteligentes."
    ),
    hour: "1",
    room: "Barigui",
    image: oliveiraFace,
    ...getCompanyInfo("Renesas"),
  },
  {
    id: 5,
    palestrante: "Cícero Pompeu",
    position: "Gerente de Marketing de Produto LATAM ",
    descriptionBanner: formatDescription(
      "Engenheiro de marketing de produto com mais de 30 anos de experiência em desenvolvimento de hardware e software. Atualmente, ele trabalha na equipe de marketing de produtos de microcontroladores para a América Latina na STMicroelectronics. Cicero se formou em engenharia elétrica na FEI (Faculdade de Engenharia Industrial) e ingressou na STMicroelectronics em 1997 como Engenheiro de Aplicação para Microcontroladores, com sede em São Paulo."
    ),
    imageBanner: pompeu,
    linkedinUrl: "https://linkedin.com/in/cicero-de-almeida-pompeu-57b194214",
    title:
      "Inovação e Performance com STM32N6: Desvendando o Futuro dos Microcontroladores  \n \n ",
    descriptionLecture: formatDescription(
      "O STM32N6 oferece alta performance, eficiência energética, segurança avançada, conectividade robusta e suporte a inteligência artificial, ideal para aplicações industriais, IoT e automação"
    ),
    hour: "2",
    room: "Barigui",
    image: pompeuFace,
    ...getCompanyInfo("STMicroelectronics"),
  },
  {
    id: 6,
    palestrante: "Dario Savastano",
    position: "Gerente de Desenvolvimento de Negócios",
    descriptionBanner: formatDescription(
      "Engenheiro Eletrônico experiente com MBA e mais de 20 anos de expertise na indústria PEMCO (Passivos, Eletromecânicos e Conectores). Possui mais de 10 anos de experiência em vendas e marketing, com foco em geração de demanda no setor de tecnologia. Treinou clientes e parceiros em toda a América do Sul e interage regularmente com a alta gestão para discutir estratégia corporativa e objetivos organizacionais. Seu compromisso com inovação e excelência contribuiu significativamente para o avanço do setor."
    ),
    imageBanner: savastano,
    linkedinUrl: "http://www.linkedin.com/in/dariosavastano",
    title: "Conectores: Muito Mais do que Plástico e Metal! \n \n \n  ",
    descriptionLecture: formatDescription(
      "Os conectores são uma parte fundamental de todo equipamento eletrônico. Qualquer dispositivo possui pelo menos um. Paradoxalmente, é um produto cuja escolha geralmente é relegada ao final do projeto, optando-se muitas vezes por opções conhecidas (embora nem sempre as mais indicadas). Nesta breve apresentação, vamos mostrar a tecnologia por trás dos conectores: as considerações de design básicas e avançadas que qualquer engenheiro deve levar em conta ao escolher o melhor produto para sua aplicação final."
    ),
    hour: "2",
    room: "Barigui",
    image: savastanoFace,
    companyLogo: companyLogos.find((item) => item.title === "Cvilux").logo,
  },
  {
    id: 7,
    palestrante: "Eduardo Conrad Jr.",
    position: "Engenheiro de Projetos Embarcados",
    descriptionBanner: formatDescription(
      "Mestre em Microeletrônica e Engenheiro Eletrônico pela UFRGS, formação CI Brasil/MCTI para projetos Mistos.  Atuando a mais de 11 anos no mercado de semicondutores como engenheiro de vendas e especialista em sistemas.  Extensa experiencia em projetos mistos e analógicos, suportando clientes da América do Sul nas áreas IoT, analógicos e MCUs."
    ),
    imageBanner: eduardo,
    linkedinUrl: "https://www.linkedin.com/in/eduardo-conrad-junior/",
    title: "O Tempo Importa – RTC Externo vs. RTC Integrado em MCUs \n \n \n ",
    descriptionLecture: formatDescription(
      "Discorrerá sobre a divisão de Timing da Epson, enfatizando as especificidades de  dos principais componentes . Apresentará um case muito interessante sobre os limites de até onde usar RTCs internos ao MCU versus RTC externo. Será avaliado a  periferia necessária em ambas as aplicações de RTC."
    ),
    hour: "2",
    room: "Barigui",
    image: eduardoFace,
    companyLogo: companyLogos.find((item) => item.title === "Epson").logo,
  },
  {
    id: 8,
    palestrante: "Fábio Costa",
    position: "Gerente Regional de Vendas",
    descriptionBanner: formatDescription(
      "Com uma década na Würth Elektronik, minha jornada tem sido marcada por um compromisso inabalável em expandir nossa base de clientes e aumentar o lucro bruto através de um controle meticuloso de custos. A dedicação de nossa equipe tem sido fundamental para fomentar relacionamentos sólidos com distribuidores e elevar consistentemente os negócios em todo o Brasil. Minha expertise em engenharia, combinada com um MBA em Gestão Empresarial, me permitiu não apenas apoiar, mas também treinar engenheiros de P&D no cenário brasileiro de manufatura eletrônica. Esta combinação de conhecimento técnico e capacidade comercial nos posiciona para liderar e inovar nesta indústria dinâmica e acelerada."
    ),
    imageBanner: fabio,
    linkedinUrl: "https://www.linkedin.com/in/fabiocosta/",
    title: "Depuração de EMC em Conversores Flyback \n \n \n",
    descriptionLecture: formatDescription(
      "Neste estudo de caso veremos a influência de diversos componentes para evitar e eliminar ruídos EMI em uma fonte Flyback."
    ),
    hour: "2",
    room: "Tanguá",
    image: fabioFace,
    ...getCompanyInfo("Würth"),
  },
  {
    id: 9,
    palestrante: "Fellipe Corradi",
    position: "Gerente de Vendas",
    descriptionBanner: formatDescription(
      "Fellipe Corradi Amaral é o Gerente de Vendas da CVILux no Brasil, onde supervisiona as estratégias comerciais e a expansão de mercado no setor de Conectores. Com formação na área de Administração de Empresas, Fellipe traz uma vasta experiência e conhecimento para seu papel, impulsionando o crescimento e a inovação na indústria."
    ),
    imageBanner: corradi,
    linkedinUrl: "https://www.linkedin.com/in/fellipe-corradi-amaral-08569194",
    title: "Conectores: Muito Mais do que Plástico e Metal! \n \n \n ",
    descriptionLecture: formatDescription(
      "Os conectores são uma parte fundamental de todo equipamento eletrônico. Qualquer dispositivo possui pelo menos um. Paradoxalmente, é um produto cuja escolha geralmente é relegada ao final do projeto, optando-se muitas vezes por opções conhecidas (embora nem sempre as mais indicadas). Nesta breve apresentação, vamos mostrar a tecnologia por trás dos conectores: as considerações de design básicas e avançadas que qualquer engenheiro deve levar em conta ao escolher o melhor produto para sua aplicação final."
    ),
    hour: "3",
    room: "Tanguá",
    image: corradiFace,
    ...getCompanyInfo("Cvilux"),
  },
  {
    id: 10,
    palestrante: "Flávio Mituuti",
    position: "Engenheiro de Aplicação de Campo",
    descriptionBanner: formatDescription(
      "Minha carreira teve início como desenvolvedor de hardware e firmware de balanças eletrônicas, atuando nessa área por 6 anos. Após essa experiência inicial, migrei para o setor de promoção e venda de componentes eletrônicos, sempre desempenhando a função de FAE (Field Application Engineer). Trabalhei por 6 anos na Arrow e por 5 anos na TCT, até chegar à minha posição atual na Ammon&Rizos, representante da Onsemi no Brasil"
    ),
    imageBanner: mituuti,
    linkedinUrl: "https://linkedin.com/in/flavio-takeshi-mituuti-a641a9ba",
    title: "SiC JFET \n \n \n \n",
    descriptionLecture: formatDescription(
      "A complementação da tecnologia SiC JFET na linha onsemi expande a família EliteSiC e nos torna capazes de endereçar as necessidades por alta eficiência energética e densidade de potencia no estagio AC-DC em fontes para data centers de inteligência artificial. Em veículos elétricos o SiC JFET ajuda a aumentar eficiência e robustez substituindo múltiplos componentes com um circuito de chaveamento baseado na tecnologia SiC JFET nas unidades de desacoplamento de baterias. Nas indústrias o SiC JFET habilita algumas topologias de armazenamento de energia e de disjuntores de estado sólido."
    ),
    hour: "3",
    room: "Tanguá",
    image: mituutiFace,
    ...getCompanyInfo("ON Semiconductor"),
  },
  {
    id: 11,
    palestrante: "Gabriel Barbosa",
    position: "Engenheiro de Aplicação e Vendas",
    descriptionBanner: formatDescription(
      "Gabriel Barbosa Flor é Engenheiro de Aplicação e Vendas na Alliance Rep. Há mais de 10 anos trabalha no suporte e desenvolvimento de novos negócios com foco em iluminação e sensoriamento."
    ),
    imageBanner: gabriel,
    linkedinUrl: "https://www.linkedin.com/in/gabrielbarbosaflor/",
    title: "Soluções de Iluminação e Sensoriamento da ams-OSRAM \n \n \n ",
    descriptionLecture: formatDescription(
      "Venha saber mais sobre os produtos inovadores da ams-OSRAM em sensores e luz. Apresentaremos os mais recentes lançamentos em sensores de imagem, luz, magnéticos e ToF (Time of Flight), além de produtos de iluminação e visualização baseados nas mais modernas tecnologias em LEDs!"
    ),
    hour: "4",
    room: "Tingui",
    image: gabrielFace,
    ...getCompanyInfo("Osram"),
  },
  {
    id: 12,
    palestrante: "Gene Volchenko",
    position: "Diretor de Desenvolvimento de Negócios",
    descriptionBanner: formatDescription(
      "Gene Volchenko possui mais de 24 anos de experiência na indústria eletrônica. Ingressou na Vishay em 2005 como Engenheiro de Aplicação de Campo, passou pela Maxim Integrated Products como especialista em PMIC e retornou à Vishay em 2011, onde atuou como Diretor de Marketing Regional e, em 2023, foi promovido a Diretor de Desenvolvimento de Negócios. Antes disso, trabalhou na Motorola Automotive Group por 6 anos em projetos de controle de motores, no início da carreira, atuou por 7 anos como Chefe do Departamento de Rádio em navios mercantes da Ucrânia, sendo responsável por sistemas de navegação, comunicação e energia. Gene possui um Mestrado em Engenharia Eletrônica pela Odessa Marine Academy – Odessa, Ucrânia, e um Bacharelado em Engenharia Eletrônica pelo Kherson Marine College – Kherson, Ucrânia."
    ),
    imageBanner: gene,
    linkedinUrl: "https://www.linkedin.com/in/genevolchenko/",
    title:
      "Tendências Futuras em Eletrônica de Potência - Eficiência Energética e Sustentabilidade",
    descriptionLecture: formatDescription(
      "A eletrônica de potência é um campo crítico que impulsiona inovações na conversão de energia, gerenciamento de potência e sustentabilidade. Conforme cresce a demanda global por soluções energeticamente eficientes, a indústria está se voltando para tecnologias que minimizam perdas de energia, reduzem a pegada de carbono e apoiam a integração de fontes renováveis. A Vishay, um dos principais fabricantes de semicondutores discretos e componentes passivos, está na vanguarda desses avanços e apresentará os produtos mais recentes e os roadmaps de produtos para demonstrar sua estratégia para o futuro."
    ),
    hour: "3",
    room: "Tanguá",
    image: geneFace,
    ...getCompanyInfo("Vishay"),
  },
  {
    id: 13,
    palestrante: "Horácio Garcia",
    position: "Engenheiro de Aplicação de Campo - MCUs",
    descriptionBanner: formatDescription(
      "Horacio Garcia é Field Application Engineer na NXP Semiconductors, especializado no desenvolvimento e suporte de MCUs para aplicações embarcadas. Doutor em Engenharia Elétrica e Controle Automático pelo CINVESTAV Guadalajara e pela Università degli Studi dell'Aquila, possui experiência em controle de sistemas multiagentes, sistemas embarcados e design de hardware e software. Já atuou em projetos de UAVs, sistemas inteligentes e controle distribuído. Com forte perfil técnico e acadêmico, combina pesquisa e inovação para resolver desafios em automação e sistemas embarcados."
    ),
    imageBanner: horacio,
    linkedinUrl: "https://br.linkedin.com/in/horacio-de-jesus-garcia-vazquez",
    title:
      "MCX W Series: Plataforma Segura e Escalável para Conectividade Sem Fio \n \n",
    descriptionLecture: formatDescription(
      "A série MCX W da NXP é uma plataforma de microcontroladores sem fio multiprotocolo projetada para maximizar a flexibilidade em aplicações IoT, industriais e de casa inteligente. Oferece integração com Matter, Thread, Zigbee e Bluetooth LE, além de avançados recursos de localização e segurança EdgeLock. Nesta sessão, exploraremos as principais características do MCX W71, seu ecossistema de desenvolvimento com MCUXpresso, e realizaremos um hands-on para configuração, atualização de firmware e testes de conectividade sem fio com o kit FRDM-MCXW71."
    ),
    hour: "3",
    room: "Tingui",
    image: horacioFace,
    ...getCompanyInfo("NXP Semiconductors"),
  },
  {
    id: 14,
    palestrante: "José de Freitas",
    position: "Gerente de Aplicações",
    descriptionBanner: formatDescription(
      "Jose Ricardo de Freitas é Engenheiro Senior da STMicroelectronics. Graduado em Engenharia Elétrica pela Escola de Engenharia Mauá e MBA em Gestão Empresarial pela Fundação Getúlio Vargas é responsável pelas aplicações com sensores MEMs e NBIOT na STMicroelectronics da América do Sul"
    ),
    imageBanner: freitas,
    linkedinUrl: "https://linkedin.com/in/ricardo-freitas-92b9183",
    title: "Estúdio MEMs \n \n \n \n  ",
    descriptionLecture: formatDescription(
      "Aprendendo a Explorar os Sensores da ST com a ferramenta MEMs-Studio"
    ),
    hour: "4",
    room: "Tingui",
    image: freitasFace,
    ...getCompanyInfo("STMicroelectronics"),
  },
  {
    id: 15,
    palestrante: "Michael Guarizo",
    position: "Engenheiro de Aplicação de Campo",
    descriptionBanner: formatDescription(
      "Engenheiro de Aplicações Graduado em Engenharia Elétrica pela Universidade Federal de Itajubá, atuou por mais de 10 anos no desenvolvimento de conversores AC/DC para aplicações da área médica, que requerem um equilíbrio preciso entre custo e atendimento às normas. Desde 2023, atua como Engenheiro de Aplicações na BP&M, realizando suporte no desenvolvimento e testes de bancada, com ênfase no portfólio da Power Integrations e outros fabricantes/itens tipicamente utilizados em projetos AC/DC."
    ),
    imageBanner: guarizo,
    linkedinUrl: "https://www.linkedin.com/in/michael-felipe-guarizo-813011143",
    title:
      "Desvendando a linha de conectividade e inteligência artificial NXP \n \n",
    descriptionLecture: formatDescription(""),
    hour: "4",
    room: "Tingui",
    image: guarizoFace,
    ...getCompanyInfo("Yageo"),
  },
  {
    id: 16,
    palestrante: "Michael Sparhawk",
    position: "Diretor de Vendas",
    descriptionBanner: formatDescription(
      "Com 25 anos de experiência em vendas e marketing de componentes passivos, tenho sólida experiência tanto na distribuição quanto na fabricação. Em 2011, minha equipe lançou a presença da Viking Tech na América do Norte e do Sul. Tem sido uma jornada empolgante contribuir para uma empresa reconhecida por sua expertise em componentes passivos de precisão!"
    ),
    imageBanner: sparhawk,
    linkedinUrl: "https://www.linkedin.com/in/michaelsparhawk/",
    title:
      "Resistores de Filme Fino vs. Resistores de Filme Grosso: Precisão e Desempenho com a Viking Tech",
    descriptionLecture: formatDescription(
      "Nesta apresentação, exploraremos as principais diferenças entre resistores de filme fino e resistores de filme grosso, destacando a precisão superior, estabilidade e confiabilidade da tecnologia de filme fino. Como líder global em componentes passivos avançados, a Viking Tech está comprometida em oferecer soluções inovadoras em resistores que atendem às exigentes necessidades de indústrias como aeroespacial, médica e eletrônica de alto padrão. Descubra por que a transição para resistores de filme fino pode melhorar o desempenho dos produtos e proporcionar valor a longo prazo para suas aplicações no mercado brasileiro."
    ),
    hour: "4",
    room: "Bacacheri",
    image: sparhawkFace,
    ...getCompanyInfo("Viking"),
  },
  {
    id: 17,
    palestrante: "Miguel Luna",
    position: "Engenheiro de Aplicações",
    descriptionBanner: formatDescription(
      "Engenheiro Eletrônico pela Universidade de Sonora no México com mestrado em Sistemas de Energia pela CINVESTAV México, FAE para MCC para MOSFET, BJT, Retificador e promoção de Dispositivos de Proteção para OEM Transatlântico e Mercado de Massa na América. Mais de 10 anos de experiência combinada como Engenheiro de Projeto de Hardware em Controladores de Motores Automotivos e Fontes de Alimentação de Computação."
    ),
    imageBanner: luna,
    linkedinUrl: "https://linkedin.com/in/carlos-miguel-luna-zavala-4b771157",
    title: "Perdas de Potência e Desempenho de Comutação em MOSFETs \n \n ",
    descriptionLecture: formatDescription(
      "As perdas de potência em um circuito se traduzem em calor e perda de eficiência. Elas são críticas em MOSFETs de Potência para garantir a operação dentro de uma faixa de temperatura segura e a confiabilidade do produto. Neste seminário, abordaremos as perdas por condução e comutação no MOSFET, com expressões analíticas e métodos para calcular e estimar a dissipação de calor causada tanto pela condução quanto pela comutação."
    ),
    hour: "5",
    room: "Bacacheri",
    image: lunaFace,
    ...getCompanyInfo("MCC Semiconductor"),
  },
  {
    id: 18,
    palestrante: "Paul Siegel",
    position: "Gerente Regional de Canais TOLA, LATAM",
    descriptionBanner: formatDescription(
      "Minha família e eu moramos na região de Sacramento, Califórnia. Minha esposa Melinda é professora de pré-escola, e nossos dois filhos, Zach e Marlee, estão na faculdade. Também temos 2 cachorros (DJ e Maggie). Nossa família gosta de fazer aventuras off-road 4x4 e acampar em locais remotos. Trabalho na indústria eletrônica há mais de 30 anos. Tive algumas experiências na minha carreira, desde o início na Distribuição até trabalhar no espaço OEM. Atualmente, estou na u-blox há mais de 5 anos, desde a aquisição da Rigado."
    ),
    imageBanner: siegel,
    linkedinUrl: "https://linkedin.com/in/paul-siegel-21434b6",
    title: "Localize e Conecte-se com a U-blox \n \n \n",
    descriptionLecture: formatDescription(
      "Participe da nossa palestra para conhecer a linha de produtos de curto alcance da U-Blox, com foco nos produtos MAYA, IRIS e no módulo BLE/atualização de CPU aberta. Além disso, apresentaremos uma visão geral dos produtos GNSS, destacando os modelos ZED-F9P, ZED-X20 e MIA-M10. Descubra as últimas inovações e atualizações que a U-Blox tem a oferecer!"
    ),
    hour: "5",
    room: "Bacacheri",
    image: siegelFace,
    ...getCompanyInfo("u-blox"),
  },
  {
    id: 19,
    palestrante: "Peterson  Santos",
    position: "Gerente Regional de Negócios – América do Sul",
    descriptionBanner: formatDescription(
      "Atuando na industria de semicondutores desde o ano 2000, Peterson Roberto dos Santos é formado como técnico eletricista na ETE Jorge Street, graduado em engenharia pela Escola de Engenharia Mauá como Engenheiro eletricista, concluindo em 2008 curso de MBA em Gestão de Inovação Tecnologica na Fundação IPT. Atualmente na posição de Gerente Regional de Negócios na NXP para o mercado Sul-americano."
    ),
    imageBanner: peterson,
    linkedinUrl: "https://linkedin.com/in/peterson-roberto-dos-santos-3438a29",
    title:
      "Desvendando a linha de conectividade e inteligência artificial NXP \n \n",
    descriptionLecture: formatDescription(
      "Foram anos investindo em soluções que trouxessem para o mercado a inovação necessária para falarmos de conectividade com propriedade. Pretendemos nesta palestra apresentar a estratégia e soluções para o mercado de conectividade e IA. Pretentemos entregar para o mercado uma linha de produtos sólida para a aplicações de Edge Computing, e isto é só o começo."
    ),
    hour: "5",
    room: "Bacacheri",
    image: petersonFace,
    ...getCompanyInfo("NXP Semiconductors"),
  },
  {
    id: 20,
    palestrante: "Raphael Souza",
    position: "Gerente de Soluções Técnicas",
    descriptionBanner: formatDescription(
      "Engenheiro Elétrico formado pela USF. Especialista em soluções de iluminação LED, análise de mercado e estratégias de vendas, com mais de 8 anos de experiência e atuação no mercado da américa latina e EUA."
    ),
    imageBanner: souza,
    linkedinUrl: "https://linkedin.com/in/raphaelnsouzaa",
    title: "Lumileds: Soluções em LED Sob Medida para o Mercado Brasileiro \n \n ",
    descriptionLecture: formatDescription(
      "Você está convidado para uma palestra exclusiva onde apresentaremos as mais recentes inovações da Lumileds em soluções de LED, desenvolvidas especialmente para atender às necessidades do mercado brasileiro. Destaques da Palestra: Novos Produtos: Conheça os LEDs 5050 e 2835, projetados exclusivamente para o Brasil. Inovação e Tecnologia: Descubra como nossas soluções em LED podem transformar seus projetos com eficiência energética e durabilidade. Aplicações Práticas: Veja exemplos reais de como nossos produtos estão sendo utilizados em diversos setores."
    ),
    hour: "5",
    room: "São Lourenço",
    image: souzaFace,
    ...getCompanyInfo("Lumileds"),
  },
  {
    id: 21,
    palestrante: "Ricardo Seiti",
    position: "Engenheiro de Soluções Embarcadas",
    descriptionBanner: formatDescription(
      "Engenheiro Eletricista. Atua no mercado de eletrônica desde 2009 como engenheiro de aplicações da Atmel/Microchip. Atualmente especialista da Microchip em sistemas de comunicação sem fio e segurança."
    ),
    imageBanner: seiti,
    linkedinUrl: "https://br.linkedin.com/in/ricardo-seiti-yoshizaki-959a403a",
    title: "Ecossistema de desenvolvimento Microchip \n \n \n",
    descriptionLecture: formatDescription(
      "Neste treinamento iremos apresentar as ferramentas que a Microchip oferece para auxiliar no desenvolvimento de projetos em diversas áreas, passando por ferramentas de Geração de código Automatizados, Compiladores, Ambientes de desenvolvimento, Visualizadores de dados, Análise de redes com e sem fio, Criação de interface gráfica e touch e Ferramentas de Machine Learning."
    ),
    hour: "6",
    room: "São Lourenço",
    image: seitiFace,
    ...getCompanyInfo("Microchip"),
  },
  {
    id: 22,
    palestrante: "Rodrigo Britto",
    position: "Engenheiro Sênior de Soluções Embarcadas",
    descriptionBanner: formatDescription(
      "Engenheiro eletrônico e de computação com mais de 20 anos de experiência em sistemas embarcados e a 13 anos trabalha como engenheiro de aplicações em indústria de semicondutores, atualmente participa de 3 grupos de estudos internos na Microchip. (Power Conversion, MCU e Machine Learning)."
    ),
    imageBanner: britto,
    linkedinUrl: "https://linkedin.com/in/rodrigo-britto-52ab612b",
    title:
      "Conhecendo Soluções e Ferramentas da Microchip para Desenvolvimento com  Machine Learning",
    descriptionLecture: formatDescription(
      "Nessa palestra será apresentado conceitos de Machine Learning, aplicações de Machine Learning em Sistemas Embarcados, Ferramentas de Desenvolvimento da Microchip para Machine Learning."
    ),
    hour: "6",
    room: "São Lourenço",
    image: brittoFace,
    ...getCompanyInfo("Microchip"),
  },
  {
    id: 23,
    palestrante: "Rodrigo Chemin",
    position: "Líder de Vendas - América do Sul",
    descriptionBanner: formatDescription(
      "Gerente de Produto e Gerente de Contas de itens Automotivos voltados a Sistemistas e Chicoteiros, com 10 anos de experiencia no mercado. Atualmente Coordenador de Coordenador de Vendas América do Sul para o mercado de linha branca e Iluminação."
    ),
    imageBanner: chemin,
    linkedinUrl: "https://www.linkedin.com/in/rodrigo-chemin/",
    title: "Produtos de Iluminação para Áreas Externas \n \n \n",
    descriptionLecture: formatDescription(
      "Apresentação das principais novidades de produtos para o mercado de iluminação externa, explorando soluções e tendências do mercado, bem como introduzir uma visão geral das aplicações dos produtos desde chicotes especiais até o fornecimento de sistemas completos. Alguns dos principais produtos de nosso portifólio contemplam soluções técnicas como a família LUMiNAWISE, conectores CPC, soluções para iluminação de agricultura e cidades inteligentes."
    ),
    hour: "6",
    room: "São Lourenço",
    image: cheminFace,
    ...getCompanyInfo("TE Connectivity"),
  },
  {
    id: 24,
    palestrante: "Rogério Bueno",
    position: "Engenheiro de Marketing de Produto",
    descriptionBanner: formatDescription(
      "Rogério é Engenheiro de Marketing de Produto na STMicroelectronics, onde atua no escritório de São Paulo desde 2012. Com mais de 28 anos de experiência no desenvolvimento de produtos eletrônicos, trabalhou em engenharia, marketing e gerenciamento de produtos. Atualmente, seu foco está no setor industrial, apoiando novas tecnologias em conversão de energia, controle de motores, automação industrial e redes inteligentes. É formado em Engenharia Elétrica pela Escola de Engenharia Mauá e possui pós-graduação em marketing de produtos de tecnologia pela ESPM."
    ),
    imageBanner: bueno,
    linkedinUrl: "https://linkedin.com/in/rogeriobueno78",
    title:
      "Estudo de caso: Soluções ST para iluminação pública inteligente em cidades conectadas.",
    descriptionLecture: formatDescription(
      "Nesta palestra abordaremos todos os blocos para implementação de um sistema de iluminação pública conectada e inteligente. Apresentaremos as tecnologias de comunicação NBIoT e Power Line, metrologia, conversores chaveados, isoladores digitais, led drivers e acelerômetros."
    ),
    hour: "6",
    room: "São Lourenço",
    image: buenoFace,
    ...getCompanyInfo("STMicroelectronics"),
  },
  {
    id: 25,
    palestrante: "Fernando Barrera",
    position: "Diretor Técnico Regional",
    descriptionBanner: formatDescription(
      "Fernando Barrera é um líder de vendas com mais de 20 anos de experiência na indústria de Alta Tecnologia, especializado em Semicondutores e Soluções Eletrônicas Avançadas. Como Diretor Técnico Regional da Future Electronics, baseado no Vale do Silício, ele lidera equipes e apoia clientes na Costa Oeste dos EUA, Canadá e América Latina, Engenheiro Eletricista pela Universidade da Califórnia - San Diego, Fernando ocupou cargos de liderança na Future Electronics, Texas Instruments e National Semiconductor, Sua expertise inclui Liderança de Vendas, Desenvolvimento de Negócios e Gestão Estratégica de Contas. Reconhecido por sua capacidade de construir relacionamentos e desenvolver estratégias inovadoras, Como Keynote, Fernando abordará os desafios enfrentados por Engenheiros e times de Supply Chain ao longo do ciclo de vida dos produtos, apresentando estratégias e ferramentas para mitigar riscos nesse processo."
    ),
    imageBanner: barrera,
    linkedinUrl: "https://www.linkedin.com/in/fernandoabarrera/",
    title: "",
    descriptionLecture: formatDescription(""),
    hour: "",
    room: "São Lourenço",
    image: barreraFace,
    companyLogo: nxplogo,
  },
];

export const ROOM_COLORS = {
  tanguá: {
    name: "Tanguá",
    color: "bg-green-500",
  },
  tingui: {
    name: "Tingüi",
    color: "bg-blue-500",
  },
  "são lourenço": {
    name: "São Lourenço",
    color: "bg-orange-500",
  },
  barigui: {
    name: "Barigüi",
    color: "bg-yellow-500",
  },
  bacacheri: {
    name: "Bacacheri",
    color: "bg-pink-500",
  },
};
// Função para obter a cor da sala
export const getRoomColor = (room) => {
  const roomData = ROOM_COLORS[room.toLowerCase()];
  return roomData ? roomData.color : "bg-gray-300";
};

export default events;
