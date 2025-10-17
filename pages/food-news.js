import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getRelatedProducts, getFeaturedProducts } from '../public/product-utils';

export default function FoodNews() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 1; // Apenas 1 artigo por página

  // BANCO DE ARTIGOS - AGORA COM PRODUTOS DINÂMICOS
  const articles = [
{
  id: 1,
  title: "Farinha para Pizza: Guia Definitivo 2025 - PMG Atacadista Revela as Melhores Opções",
  description: "Descubra qual farinha de trigo usar para pizza segundo especialistas PMG Atacadista. Comparativo técnico entre farinhas 101, Anaconda, Buquê e Dona Benta com preços atacado.",
  image: "https://i.imgur.com/tOcUDsC.jpeg",
  category: "Farináceos",
  section: "analise-produtos",
  readTime: "8 min de leitura",
  date: "2025-10-16",
  author: "Marques Vendas PMG Atacadista",
  featured: true,
  content: `
    <!-- INTRODUÇÃO COM FOCO EM SEO -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 15px;">🍕 Farinha para Pizza: O Segredo por Trás da Massa Perfeita</h2>
      <p>Como <strong>distribuidora especializada em food service</strong>, a PMG Atacadista revela neste guia completo tudo o que você precisa saber sobre farinhas para pizza. A escolha da farinha certa não é apenas uma questão de sabor, mas de <strong>rentabilidade para seu negócio</strong>.</p>
      
      <div style="background: #f0f8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #095400; margin: 0 0 10px 0;">📈 Destaque PMG:</h3>
        <p style="margin: 0; font-weight: 600;">Pizzarias que usam farinhas especializadas têm até <strong>30% mais lucro</strong> por conta da qualidade superior e menor índice de desperdício.</p>
      </div>
    </section>

    <!-- IMAGEM PRINCIPAL -->
    <section style="margin-bottom: 30px;">
      <img src="https://i.imgur.com/tOcUDsC.jpeg" alt="Melhores farinhas para pizza - Guia PMG Atacadista 2025" style="width: 100%; border-radius: 10px; margin: 20px 0;" />
      <p style="text-align: center; color: #666; font-style: italic; font-size: 0.9rem;">Comparativo das principais farinhas para pizza disponíveis na PMG Atacadista</p>
    </section>

    <!-- CARACTERÍSTICAS TÉCNICAS -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 15px;">🔬 Características Técnicas da Farinha de Pizza Ideal</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">⚡</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Proteína: 11-13%</h4>
          <p style="margin: 0; font-size: 0.9rem;">Ideal para massa elástica e estrutura firme</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">💧</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Absorção: 55-65%</h4>
          <p style="margin: 0; font-size: 0.9rem;">Maior rendimento e hidratação adequada</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🌾</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">W: 280-320</h4>
          <p style="margin: 0; font-size: 0.9rem;">Força ideal para fermentação longa</p>
        </div>
      </div>

      <p>Segundo nosso <strong>time de especialistas em panificação da PMG Atacadista</strong>, esses parâmetros garantem massa com:</p>
      <ul style="padding-left: 20px;">
        <li><strong>Elasticidade perfeita</strong> para abertura uniforme</li>
        <li><strong>Fermentação controlada</strong> sem colapsar</li>
        <li><strong>Crocância exterior</strong> com miolo aerado</li>
        <li><strong>Maior rendimento</strong> por quilo de farinha</li>
      </ul>
    </section>

    <!-- COMPARATIVO DAS FARINHAS -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🏆 Comparativo: 4 Melhores Farinhas para Pizza do Mercado</h2>
      
      <div style="background: #fff; border: 2px solid #095400; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">1. Farinha de Trigo Pizza Dona Benta 5kg</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-dona-benta-5-kilo-fdo-25-kilo-pmg-atacadista.jpg" 
               alt="Farinha Dona Benta para Pizza - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Características PMG:</strong> Farinha premium com W 320, desenvolvida para pizzarias de alto padrão. Garante massa extremamente elástica e sabor superior.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Indicação PMG:</strong> Ideal para pizzarias gourmet e estabelecimentos que buscam diferenciação no mercado.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 113,17</span>
              <a href="https://www.marquesvendaspmg.shop/produto/1748" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR DONA BENTA →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">2. Farinha de Trigo Pizza 101 - 5kg</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-101-5-kilo-fdo-25-kilo-pmg-atacadista.jpg" 
               alt="Farinha 101 para Pizza - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Características PMG:</strong> Alta absorção de água (62%) e glúten bem desenvolvido. Perfeita para produção em grande escala com consistência garantida.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Indicação PMG:</strong> Melhor custo-benefício para redes de pizzaria e delivery com alta rotatividade.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 85,46</span>
              <a href="https://www.marquesvendaspmg.shop/produto/1745" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR FARINHA 101 →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">3. Farinha de Trigo Pizza Buquê - 5kg</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-buque-5-kilo-fdo-25-kilo-pmg-atacadista.jpg" 
               alt="Farinha Buquê para Pizza - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Características PMG:</strong> Equilíbrio perfeito entre elasticidade e crocância. W 290 ideal para fermentações de 24 a 48 horas.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Indicação PMG:</strong> Excelente opção para pizzarias artesanais que valorizam sabor autêntico.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 79,82</span>
              <a href="https://www.marquesvendaspmg.shop/produto/1747" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR FARINHA BUQUÊ →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">4. Farinha de Trigo Pizza Anaconda - 5kg</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/farinha-de-trigo-pizza-anaconda-5-kilo-fdo-25-kilo-pmg-atacadista.jpg" 
               alt="Farinha Anaconda para Pizza - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Características PMG:</strong> Desenvolvida para fermentação controlada e textura única. Alta tolerância a variações de temperatura.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Indicação PMG:</strong> Ideal para estabelecimentos com equipes em treinamento ou processos padronizados.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 84,45</span>
              <a href="https://www.marquesvendaspmg.shop/produto/1746" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR FARINHA ANACONDA →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TABELA COMPARATIVA -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">📋 Tabela Comparativa: Farinhas para Pizza PMG Atacadista</h2>
      
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #095400; color: white;">
              <th style="padding: 15px; text-align: left;">Farinha</th>
              <th style="padding: 15px; text-align: center;">Proteína</th>
              <th style="padding: 15px; text-align: center;">W</th>
              <th style="padding: 15px; text-align: center;">Absorção</th>
              <th style="padding: 15px; text-align: center;">Preço 5kg</th>
              <th style="padding: 15px; text-align: center;">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Dona Benta</td>
              <td style="padding: 15px; text-align: center;">13%</td>
              <td style="padding: 15px; text-align: center;">320</td>
              <td style="padding: 15px; text-align: center;">65%</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 113,17</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/1748" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Farinha 101</td>
              <td style="padding: 15px; text-align: center;">12.5%</td>
              <td style="padding: 15px; text-align: center;">300</td>
              <td style="padding: 15px; text-align: center;">62%</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 85,46</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/1745" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Buquê</td>
              <td style="padding: 15px; text-align: center;">12%</td>
              <td style="padding: 15px; text-align: center;">290</td>
              <td style="padding: 15px; text-align: center;">58%</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 79,82</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/1747" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; font-weight: 600;">Anaconda</td>
              <td style="padding: 15px; text-align: center;">11.8%</td>
              <td style="padding: 15px; text-align: center;">295</td>
              <td style="padding: 15px; text-align: center;">60%</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 84,45</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/1746" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- RECOMENDAÇÃO FINAL -->
    <section style="background: linear-gradient(135deg, #095400, #0a6b00); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 15px 0; font-size: 1.5rem;">🎯 Recomendação PMG Atacadista</h2>
      <p style="margin: 0 0 20px 0; font-size: 1.1rem;">Baseado em nossa experiência com mais de 100 pizzarias clientes:</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🏆</div>
          <h4 style="margin: 0 0 8px 0;">Pizzaria Premium</h4>
          <p style="margin: 0; font-size: 0.9rem;">Dona Benta - Diferenciação garantida</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">💰</div>
          <h4 style="margin: 0 0 8px 0;">Melhor Custo-Benefício</h4>
          <p style="margin: 0; font-size: 0.9rem;">Farinha 101 - Alta produtividade</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">👨‍🍳</div>
          <h4 style="margin: 0 0 8px 0;">Artesanal</h4>
          <p style="margin: 0; font-size: 0.9rem;">Buquê - Sabor autêntico</p>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION FINAL -->
    <section style="text-align: center; padding: 40px; background: #f0f8f0; border-radius: 10px; margin-top: 30px;">
      <h2 style="color: #095400; margin: 0 0 15px 0; font-size: 1.6rem;">🚀 Pronto para Escolher Sua Farinha Ideal?</h2>
      <p style="color: #555; margin: 0 0 25px 0; font-size: 1.1rem;">
        Nossa equipe de especialistas PMG Atacadista está pronta para te ajudar a escolher a farinha perfeita para seu negócio.
      </p>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <a href="https://www.marquesvendaspmg.shop/categoria/farinaceos" 
           style="background: #095400; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease;">
           VER TODAS AS FARINHAS
        </a>
        
        <a href="https://wa.me/5511913572902?text=Olá! Gostaria de ajuda para escolher a melhor farinha para minha pizzaria." 
           style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease;">
           FALAR COM ESPECIALISTA
        </a>
      </div>
      
      <p style="color: #666; margin: 20px 0 0 0; font-size: 0.9rem;">
        📞 <strong>Atendimento Personalizado:</strong> (11) 91357-2902 | ✉️ <strong>Email:</strong> marquesvendaspmg@gmail.com
      </p>
    </section>
  `
},
{
  id: 2,
  title: "Melhores Vodkas para Bar 2025: Guia Definitivo PMG Atacadista com Preços e Análise Técnica",
  description: "Especialista PMG revela as melhores vodkas para bar: Absolut, Smirnoff, Belvedere e mais. Comparativo técnico, preços atacado e estratégias para lucrar até 400%.",
  image: "https://i.imgur.com/s626IF9.jpeg",
  category: "Bebidas",
  section: "analise-produtos", 
  readTime: "9 min de leitura",
  date: "2025-10-16",
  author: "Marques Vendas PMG Atacadista",
  featured: true,
  content: `
    <!-- INTRODUÇÃO COM IMPACTO -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 15px;">🍸 Vodka para Bar: A Espinha Dorsal do Seu Lucro em Bebidas</h2>
      <p>Como <strong>distribuidora líder em bebidas para food service</strong>, a PMG Atacadista apresenta o guia mais completo sobre vodkas para bares e restaurantes. A escolha certa não é sobre marca, mas sobre <strong>rentabilidade e satisfação do cliente</strong>.</p>
      
      <div style="background: #f0f8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #095400; margin: 0 0 10px 0;">💰 Destaque PMG:</h3>
        <p style="margin: 0; font-weight: 600;">Bares que otimizam seu portfólio de vodkas têm <strong>margem média de 400%</strong> e reduzem estoque em 30% com nosso mix estratégico.</p>
      </div>
    </section>

    <!-- IMAGEM PRINCIPAL -->
    <section style="margin-bottom: 30px;">
      <img src="https://i.imgur.com/s626IF9.jpeg" alt="Melhores vodkas para bar - Guia PMG Atacadista 2024" style="width: 100%; border-radius: 10px; margin: 20px 0;" />
      <p style="text-align: center; color: #666; font-style: italic; font-size: 0.9rem;">Seleção premium de vodkas disponíveis na PMG Atacadista para seu estabelecimento</p>
    </section>

    <!-- CATEGORIZAÇÃO DAS VODKAS -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🏷️ Categorias de Vodka: Entenda para Lucrar Mais</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #095400;">
          <div style="font-size: 2rem; margin-bottom: 10px;">⭐</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Premium</h4>
          <p style="margin: 0; font-size: 0.9rem;">Belvedere, Cîroc<br>Margem: 500-600%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #ff6b00;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🏆</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Mid-Range</h4>
          <p style="margin: 0; font-size: 0.9rem;">Absolut, Ketel One<br>Margem: 350-450%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #00a8ff;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🚀</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Value</h4>
          <p style="margin: 0; font-size: 0.9rem;">Smirnoff, Orloff<br>Margem: 250-300%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #9c27b0;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🎯</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Well Drinks</h4>
          <p style="margin: 0; font-size: 0.9rem;">Balalaika, Skyy<br>Margem: 200-250%</p>
        </div>
      </div>

      <p>Nosso <strong>time de especialistas em bebidas da PMG Atacadista</strong> recomenda ter pelo menos uma vodka de cada categoria para atender todos os perfis de cliente.</p>
    </section>

    <!-- ANÁLISE DAS VODKAS PREMIUM -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🥇 Vodkas Premium: Excelência que Justifica o Investimento</h2>
      
      <div style="background: #fff; border: 2px solid #095400; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">1. Vodka Belvedere 700ml - A Polonesa de Luxo</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/vodka-belvedere-700-ml-pmg-atacadista.jpg" 
               alt="Vodka Belvedere 700ml - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Feita com centeio Dankowski, quadrupla destilação. Notas de baunilha e creme com final limpo. <strong>Ideal para drinks sofisticados e consumo puro.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Preço de venda sugerido: R$ 45-60 a dose. Margem: 580%. Cliente que pede Belvedere tem ticket médio 40% maior.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 116,57</span>
              <a href="https://www.marquesvendaspmg.shop/produto/332" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR BELVEDERE →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">2. Vodka Cîroc Red Berry 750ml - A Francesa com Sabores</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/vodka-ciroc-red-berry-750-ml-pmg-atacadista.jpg" 
               alt="Vodka Cîroc Red Berry 750ml - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Única vodka do mundo feita de uvas Mauzac Blanc. Sabores naturais de frutas vermelhas. <strong>Perfeita para coquetéis modernos e público feminino.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Destaque em cocktails coloridos. Preço dose: R$ 35-50. Margem: 520%. Aumenta vendas em happy hour.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 175,46</span>
              <a href="https://www.marquesvendaspmg.shop/produto/334" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR CÎROC →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VODKAS MID-RANGE -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🥈 Vodkas Mid-Range: O Equilíbrio Perfeito entre Qualidade e Custo</h2>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">3. Vodka Absolut 1L - A Clássica Sueca</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/vodka-absolut-1-l-pmg-atacadista.jpg" 
               alt="Vodka Absolut 1L - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Feita com trigo de inverno sueco, água de fonte própria. Sabor limpo e versátil. <strong>A vodka mais reconhecida globalmente - vende por si só.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Carro-chefe do bar. Preço dose: R$ 18-25. Margem: 420%. Estoque mínimo: 6 unidades.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 76,07</span>
              <a href="https://www.marquesvendaspmg.shop/produto/327" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR ABSOLUT →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">4. Vodka Ketel One 1L - A Holandesa Premium Acessível</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/vodka-ketel-one-1-l-pmg-atacadista.jpg" 
               alt="Vodka Ketel One 1L - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Família Bottichel destila desde 1691. Notas cítricas e final suave. <strong>Preferida de bartenders por sua versatilidade.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Destaque em Martinis. Preço dose: R$ 20-28. Margem: 380%. Excelente custo-benefício.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 84,29</span>
              <a href="https://www.marquesvendaspmg.shop/produto/335" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR KETEL ONE →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VODKAS VALUE -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🥉 Vodkas Value: Alto Giro e Margem Garantida</h2>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">5. Vodka Smirnoff 998ml - A Líder de Mercado</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/vodka-smirnoff-998-ml-pmg-atacadista.jpg" 
               alt="Vodka Smirnoff 998ml - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Tripla destilação, 10 filtragens. Sabor neutro e consistente. <strong>A vodka mais vendida do mundo - confiança garantida.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Well drink principal. Preço dose: R$ 12-18. Margem: 320%. Estoque mínimo: 12 unidades.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 33,13</span>
              <a href="https://www.marquesvendaspmg.shop/produto/339" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR SMIRNOFF →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">6. Vodka Orloff 1L - O Custo-Benefício Inteligente</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/vodka-orloff-1-l-pmg-atacadista.jpg" 
               alt="Vodka Orloff 1L - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Produzida na França, qualidade europeia a preço acessível. <strong>Ideal para promoções e eventos.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Vodka da casa econômica. Preço dose: R$ 10-15. Margem: 280%. Alto volume.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 25,77</span>
              <a href="https://www.marquesvendaspmg.shop/produto/336" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR ORLOFF →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TABELA COMPARATIVA -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">📊 Tabela Comparativa: Vodkas PMG Atacadista</h2>
      
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #095400; color: white;">
              <th style="padding: 15px; text-align: left;">Vodka</th>
              <th style="padding: 15px; text-align: center;">Categoria</th>
              <th style="padding: 15px; text-align: center;">Origem</th>
              <th style="padding: 15px; text-align: center;">Preço Atacado</th>
              <th style="padding: 15px; text-align: center;">Margem Sugerida</th>
              <th style="padding: 15px; text-align: center;">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Belvedere</td>
              <td style="padding: 15px; text-align: center;">Premium</td>
              <td style="padding: 15px; text-align: center;">Polônia</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 116,57</td>
              <td style="padding: 15px; text-align: center; color: #27ae60; font-weight: 600;">580%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/332" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Cîroc Red Berry</td>
              <td style="padding: 15px; text-align: center;">Premium</td>
              <td style="padding: 15px; text-align: center;">França</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 175,46</td>
              <td style="padding: 15px; text-align: center; color: #27ae60; font-weight: 600;">520%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/334" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Absolut</td>
              <td style="padding: 15px; text-align: center;">Mid-Range</td>
              <td style="padding: 15px; text-align: center;">Suécia</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 76,07</td>
              <td style="padding: 15px; text-align: center; color: #f39c12; font-weight: 600;">420%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/327" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Smirnoff</td>
              <td style="padding: 15px; text-align: center;">Value</td>
              <td style="padding: 15px; text-align: center;">Rússia</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 33,13</td>
              <td style="padding: 15px; text-align: center; color: #e74c3c; font-weight: 600;">320%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/339" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; font-weight: 600;">Orloff</td>
              <td style="padding: 15px; text-align: center;">Well Drink</td>
              <td style="padding: 15px; text-align: center;">França</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 25,77</td>
              <td style="padding: 15px; text-align: center; color: #e74c3c; font-weight: 600;">280%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/336" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ESTRATÉGIA DE NEGÓCIO -->
    <section style="background: linear-gradient(135deg, #095400, #0a6b00); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 15px 0; font-size: 1.5rem;">🎯 Estratégia PMG: Mix Ideal para Seu Bar</h2>
      <p style="margin: 0 0 20px 0; font-size: 1.1rem;">Baseado em nossa experiência com mais de 200 estabelecimentos clientes:</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🍸</div>
          <h4 style="margin: 0 0 8px 0;">Bar Premium</h4>
          <p style="margin: 0; font-size: 0.9rem;">Belvedere + Cîroc + Ketel One</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🏪</div>
          <h4 style="margin: 0 0 8px 0;">Bar Comercial</h4>
          <p style="margin: 0; font-size: 0.9rem;">Absolut + Smirnoff + Orloff</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🎉</div>
          <h4 style="margin: 0 0 8px 0;">Casa Noturna</h4>
          <p style="margin: 0; font-size: 0.9rem;">Cîroc + Absolut + Skyy</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🍹</div>
          <h4 style="margin: 0 0 8px 0;">Restaurante</h4>
          <p style="margin: 0; font-size: 0.9rem;">Ketel One + Smirnoff</p>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION FINAL -->
    <section style="text-align: center; padding: 40px; background: #f0f8f0; border-radius: 10px; margin-top: 30px;">
      <h2 style="color: #095400; margin: 0 0 15px 0; font-size: 1.6rem;">🚀 Quer um Plano Personalizado para Seu Estabelecimento?</h2>
      <p style="color: #555; margin: 0 0 25px 0; font-size: 1.1rem;">
        Nossos especialistas em bebidas da PMG Atacadista criam um mix perfeito para seu bar com base no seu perfil de cliente e localização.
      </p>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <a href="https://www.marquesvendaspmg.shop/categoria/bebidas" 
           style="background: #095400; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease;">
           VER TODAS AS VODKAS
        </a>
        
        <a href="https://wa.me/5511913572902?text=Olá! Gostaria de uma consultoria para montar o cardápio de vodkas do meu bar." 
           style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease;">
           CONSULTORIA GRATUITA
        </a>
      </div>
      
      <p style="color: #666; margin: 20px 0 0 0; font-size: 0.9rem;">
        🎓 <strong>Especialista PMG:</strong> Temos sommeliers de bebidas para te assessorar | 📦 <strong>Entrega:</strong> Todo Grande SP
      </p>
    </section>
  `
},
{
  id: 3,
  title: "Queijos para Restaurante 2025: Guia PMG Atacadista com Melhores Opções, Preços e Estratégias de Lucro",
  description: "Especialista PMG revela os melhores queijos para restaurante: Muçarela Bari, Emmental, Gouda e mais. Análise técnica, preços atacado e como lucrar até 300% com cardápio de queijos.",
  image: "https://i.imgur.com/Kkd6K09.jpeg",
  category: "Derivados de Leite",
  section: "analise-produtos",
  readTime: "8 min de leitura", 
  date: "2025-10-15",
  author: "Marques Vendas PMG Atacadista",
  featured: true,
  content: `
    <!-- INTRODUÇÃO COM IMPACTO -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 15px;">🧀 Queijos Premium: O Segredo para Cardápios que Encantam e Lucram</h2>
      <p>Como <strong>distribuidora especializada em food service</strong>, a PMG Atacadista apresenta o guia definitivo sobre queijos para restaurantes. A escolha estratégica dos queijos pode <strong>elevar seu ticket médio em 25%</strong> e fidelizar clientes exigentes.</p>
      
      <div style="background: #f0f8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #095400; margin: 0 0 10px 0;">💰 Destaque PMG:</h3>
        <p style="margin: 0; font-weight: 600;">Restaurantes que investem em queijos premium têm <strong>margem média de 300%</strong> e reduzem desperdício em 40% com nosso mix estratégico.</p>
      </div>
    </section>

    <!-- IMAGEM PRINCIPAL -->
    <section style="margin-bottom: 30px;">
      <img src="https://i.imgur.com/Kkd6K09.jpeg" alt="Melhores queijos para restaurante - Guia PMG Atacadista 2024" style="width: 100%; border-radius: 10px; margin: 20px 0;" />
      <p style="text-align: center; color: #666; font-style: italic; font-size: 0.9rem;">Seleção premium de queijos disponíveis na PMG Atacadista para seu restaurante</p>
    </section>

    <!-- CATEGORIZAÇÃO DOS QUEIJOS -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🏷️ Categorias de Queijo: Estratégia para Cada Tipo de Estabelecimento</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #095400;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🍕</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Fusão & Derretimento</h4>
          <p style="margin: 0; font-size: 0.9rem;">Muçarela Bari, Prato<br>Margem: 250-350%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #ff6b00;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🍝</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Gourmet & Sofisticação</h4>
          <p style="margin: 0; font-size: 0.9rem;">Emmental, Gruyère<br>Margem: 300-400%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #00a8ff;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🥗</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Tábua & Entrada</h4>
          <p style="margin: 0; font-size: 0.9rem;">Gouda, Muçarela Búfala<br>Margem: 400-500%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #9c27b0;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🔥</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Fondue & Gratinados</h4>
          <p style="margin: 0; font-size: 0.9rem;">Emmental + Gruyère<br>Margem: 350-450%</p>
        </div>
      </div>

      <p>Nosso <strong>time de especialistas em laticínios da PMG Atacadista</strong> desenvolveu esta categorização baseada no desempenho real em mais de 150 restaurantes clientes.</p>
    </section>

    <!-- QUEIJOS PARA FUSÃO E DERRETIMENTO -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🍕 Queijos de Fusão: O Coração das Preparações Quentes</h2>
      
      <div style="background: #fff; border: 2px solid #095400; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">1. Muçarela Bari 4kg - A Campeã de Vendas</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/mucarela-bari-4-kg-pmg-atacadista.jpg" 
               alt="Muçarela Bari 4kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Derretimento perfeito, fios longos e sabor suave. <strong>Consistência garantida lote a lote</strong> - por isso é a preferida das pizzarias profissionais.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por pizza: R$ 1,38 (¼ do kg). Preço de venda: R$ 5-7 a pizza. Margem: 350%. Estoque mínimo: 8 unidades.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 27,63</span>
              <a href="https://www.marquesvendaspmg.shop/produto/719" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR MUÇARELA BARI →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">2. Queijo Prato Cristal 3,5kg - O Versátil</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/queijo-prato-cristal-35-kg-pmg-atacadista.jpg" 
               alt="Queijo Prato Cristal 3,5kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Textura semimole, derretimento cremoso. <strong>Ideal para lanches, sanduíches e pratos gratinados.</strong> Substitui o mussarela em várias preparações.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por porção: R$ 0,98 (100g). Preço venda: R$ 8-12. Margem: 320%. Mix perfeito com muçarela.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 34,39</span>
              <a href="https://www.marquesvendaspmg.shop/produto/860" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR PRATO CRISTAL →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUEIJOS GOURMET -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🍝 Queijos Gourmet: Sofisticação que Encanta</h2>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">3. Queijo Emmental Yema 13kg - O Suíço Autêntico</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/queijo-emmental-yema-13-kg-pmg-atacadista.jpg" 
               alt="Queijo Emmental Yema 13kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Olhaduras características, sabor suave e levemente adocicado. <strong>Rei dos fondue e gratinados sofisticados.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por fondue: R$ 8,65 (300g). Preço venda: R$ 45-60. Margem: 450%. Diferencial competitivo.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 72,15</span>
              <a href="https://www.marquesvendaspmg.shop/produto/834" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR EMMENTAL →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">4. Queijo Gruyère Pequeno Yema 7kg - O Francês Nobre</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/queijo-gruyere-pequeno-yema-7-kg-pmg-atacadista.jpg" 
               alt="Queijo Gruyère Yema 7kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Sabor complexo, levemente salgado com notas de nozes. <strong>Essencial para culinária francesa autêntica.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por porção: R$ 2,06 (50g). Preço venda: R$ 12-18. Margem: 480%. Justifica preço premium.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 72,15</span>
              <a href="https://www.marquesvendaspmg.shop/produto/845" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR GRUYÈRE →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUEIJOS PARA TÁBUA -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🥗 Queijos para Tábua: Experiência que Fideliza</h2>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">5. Queijo Gouda Quatá 3kg - O Holandês Acessível</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/queijo-gouda-quata-3-kg-pmg-atacadista.jpg" 
               alt="Queijo Gouda Quatá 3kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Textura semidura, sabor cremoso com notas carameladas. <strong>Perfeito para entrada e harmonização com vinhos.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por tábua: R$ 3,28 (150g). Preço venda: R$ 18-25. Margem: 450%. Encanta no primeiro contato.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 65,77</span>
              <a href="https://www.marquesvendaspmg.shop/produto/842" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR GOUDA →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">6. Muçarela de Búfala Yema 3,7kg - A Premium Italiana</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/mucarela-de-bufala-yema-37-kg-pmg-atacadista.jpg" 
               alt="Muçarela de Búfala Yema 3,7kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Sabor intenso, textura úmida e leitosa. <strong>Diferencial absoluto para pizzas gourmet e saladas premium.</strong></p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por pizza: R$ 4,73 (100g). Preço venda: R$ 25-35 adicional. Margem: 500%. Justifica upselling.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 47,29</span>
              <a href="https://www.marquesvendaspmg.shop/produto/735" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR BÚFALA →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TABELA COMPARATIVA -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">📊 Tabela Comparativa: Queijos PMG Atacadista</h2>
      
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #095400; color: white;">
              <th style="padding: 15px; text-align: left;">Queijo</th>
              <th style="padding: 15px; text-align: center;">Categoria</th>
              <th style="padding: 15px; text-align: center;">Peso</th>
              <th style="padding: 15px; text-align: center;">Preço Atacado</th>
              <th style="padding: 15px; text-align: center;">Margem Sugerida</th>
              <th style="padding: 15px; text-align: center;">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Muçarela Bari</td>
              <td style="padding: 15px; text-align: center;">Fusão</td>
              <td style="padding: 15px; text-align: center;">4 kg</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 27,63</td>
              <td style="padding: 15px; text-align: center; color: #27ae60; font-weight: 600;">350%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/719" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Emmental Yema</td>
              <td style="padding: 15px; text-align: center;">Gourmet</td>
              <td style="padding: 15px; text-align: center;">13 kg</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 72,15</td>
              <td style="padding: 15px; text-align: center; color: #27ae60; font-weight: 600;">450%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/834" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Gruyère Yema</td>
              <td style="padding: 15px; text-align: center;">Gourmet</td>
              <td style="padding: 15px; text-align: center;">7 kg</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 72,15</td>
              <td style="padding: 15px; text-align: center; color: #27ae60; font-weight: 600;">480%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/845" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Gouda Quatá</td>
              <td style="padding: 15px; text-align: center;">Tábua</td>
              <td style="padding: 15px; text-align: center;">3 kg</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 65,77</td>
              <td style="padding: 15px; text-align: center; color: #f39c12; font-weight: 600;">450%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/842" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; font-weight: 600;">Muçarela Búfala</td>
              <td style="padding: 15px; text-align: center;">Premium</td>
              <td style="padding: 15px; text-align: center;">3,7 kg</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 47,29</td>
              <td style="padding: 15px; text-align: center; color: #27ae60; font-weight: 600;">500%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/735" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- COMBINAÇÕES E HARMONIZAÇÕES -->
    <section style="background: linear-gradient(135deg, #095400, #0a6b00); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 15px 0; font-size: 1.5rem;">🎯 Combinações PMG: Mix Perfeito para Seu Restaurante</h2>
      <p style="margin: 0 0 20px 0; font-size: 1.1rem;">Baseado em nossa experiência com mais de 150 estabelecimentos:</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🍕</div>
          <h4 style="margin: 0 0 8px 0;">Pizzaria Premium</h4>
          <p style="margin: 0; font-size: 0.9rem;">Muçarela Bari + Búfala + Gouda</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🍝</div>
          <h4 style="margin: 0 0 8px 0;">Restaurante Italiano</h4>
          <p style="margin: 0; font-size: 0.9rem;">Muçarela Bari + Prato + Gruyère</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🥗</div>
          <h4 style="margin: 0 0 8px 0;">Casa de Fondue</h4>
          <p style="margin: 0; font-size: 0.9rem;">Emmental + Gruyère + Gouda</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🍷</div>
          <h4 style="margin: 0 0 8px 0;">Wine Bar</h4>
          <p style="margin: 0; font-size: 0.9rem;">Gouda + Búfala + Emmental</p>
        </div>
      </div>
    </section>

    <!-- DICAS DE ESTOQUE E CONSERVAÇÃO -->
    <section style="background: #f8f8f8; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
      <h2 style="color: #095400; margin: 0 0 15px 0; font-size: 1.4rem;">💡 Dicas PMG: Conservação e Otimização de Estoque</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">🌡️ Temperatura Ideal</h4>
          <p style="margin: 0; font-size: 0.9rem;">4-8°C em embalagem original. Nunca congelar queijos.</p>
        </div>
        
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">📦 Rotação de Estoque</h4>
          <p style="margin: 0; font-size: 0.9rem;">Muçarela: 15-20 dias | Queijos maturados: 30-45 dias</p>
        </div>
        
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">💰 Cálculo de Consumo</h4>
          <p style="margin: 0; font-size: 0.9rem;">Pizzaria: 1kg muçarela para 8-10 pizzas</p>
        </div>
        
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">🎯 Pedido Inteligente</h4>
          <p style="margin: 0; font-size: 0.9rem;">Compre às segundas - entregas mais rápidas</p>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION FINAL -->
    <section style="text-align: center; padding: 40px; background: #f0f8f0; border-radius: 10px; margin-top: 30px;">
      <h2 style="color: #095400; margin: 0 0 15px 0; font-size: 1.6rem;">🚀 Precisa de Ajuda para Montar Seu Mix de Queijos?</h2>
      <p style="color: #555; margin: 0 0 25px 0; font-size: 1.1rem;">
        Nossos especialistas em laticínios da PMG Atacadista criam um plano personalizado baseado no seu cardápio e perfil de cliente.
      </p>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <a href="https://www.marquesvendaspmg.shop/categoria/derivados-de-leite" 
           style="background: #095400; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease;">
           VER TODOS OS QUEIJOS
        </a>
        
        <a href="https://wa.me/5511913572902?text=Olá! Gostaria de uma consultoria para montar o mix de queijos do meu restaurante." 
           style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease;">
           CONSULTORIA GRATUITA
        </a>
      </div>
      
      <p style="color: #666; margin: 20px 0 0 0; font-size: 0.9rem;">
        🧀 <strong>Especialista PMG:</strong> Temos enólogos e chefs para assessoria | 📦 <strong>Entrega:</strong> Todo Grande SP com controle de temperatura
      </p>
    </section>
  `
},
{
  id: 4,
  title: "Cortes de Carne Bovina 2025: Guia PMG Atacadista para Churrascarias com Melhores Cortes, Preços e Estratégias de Lucro",
  description: "Especialista PMG revela os melhores cortes bovinos para churrascaria: Picanha, Contra Filé, Alcatra e mais. Análise técnica, preços atacado e como lucrar até 400% com churrasco premium.",
  image: "https://i.imgur.com/F2fTf4q.jpeg", 
  category: "Derivados de Bovino",
  section: "dicas-negocio",
  readTime: "9 min de leitura",
  date: "2025-10-15",
  author: "Marques Vendas PMG Atacadista",
  featured: true,
  content: `
    <!-- INTRODUÇÃO COM IMPACTO -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 15px;">🥩 Cortes Bovinos Premium: A Arte que Transforma Churrascarias em Sucesso</h2>
      <p>Como <strong>distribuidora especializada em carnes para food service</strong>, a PMG Atacadista apresenta o guia definitivo sobre cortes bovinos para churrascarias. A seleção estratégica das carnes pode <strong>aumentar seu lucro em 40%</strong> e criar clientes fiéis.</p>
      
      <div style="background: #f0f8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #095400; margin: 0 0 10px 0;">💰 Destaque PMG:</h3>
        <p style="margin: 0; font-weight: 600;">Churrascarias que dominam a seleção de cortes têm <strong>margem média de 380%</strong> e reduzem desperdício em 35% com nosso mix estratégico.</p>
      </div>
    </section>

    <!-- IMAGEM PRINCIPAL -->
    <section style="margin-bottom: 30px;">
      <img src="https://i.imgur.com/F2fTf4q.jpeg" alt="Melhores cortes de carne bovina - Guia PMG Atacadista 2024" style="width: 100%; border-radius: 10px; margin: 20px 0;" />
      <p style="text-align: center; color: #666; font-style: italic; font-size: 0.9rem;">Seleção premium de cortes bovinos disponíveis na PMG Atacadista para sua churrascaria</p>
    </section>

    <!-- HIERARQUIA DOS CORTES -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🏆 Hierarquia dos Cortes: Do Premium ao Alto Giro</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #095400;">
          <div style="font-size: 2rem; margin-bottom: 10px;">👑</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Corte Nobre</h4>
          <p style="margin: 0; font-size: 0.9rem;">Picanha, Filé Mignon<br>Margem: 400-500%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #ff6b00;">
          <div style="font-size: 2rem; margin-bottom: 10px;">⭐</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Premium Acessível</h4>
          <p style="margin: 0; font-size: 0.9rem;">Contra Filé, Alcatra<br>Margem: 350-450%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #00a8ff;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🔥</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Alto Giro</h4>
          <p style="margin: 0; font-size: 0.9rem;">Coxão Mole, Patinho<br>Margem: 250-300%</p>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #9c27b0;">
          <div style="font-size: 2rem; margin-bottom: 10px;">💼</div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Estratégico</h4>
          <p style="margin: 0; font-size: 0.9rem;">Fraldinha, Costela<br>Margem: 300-350%</p>
        </div>
      </div>

      <p>Nosso <strong>time de especialistas em carnes da PMG Atacadista</strong> desenvolveu esta hierarquia baseada no desempenho real em mais de 80 churrascarias clientes.</p>
    </section>

    <!-- CORTES NOBRES -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">👑 Cortes Nobres: A Excelência que Justifica o Preço</h2>
      
      <div style="background: #fff; border: 2px solid #095400; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">1. Picanha Bovina Resfriada Tipo A Boi Brasil 1.3kg - A Rainha do Churrasco</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/picanha-bovina-resfriada-tipo-a-boi-brasil-13-kg-pmg-atacadista.jpg" 
               alt="Picanha Bovina Boi Brasil 1.3kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Gordura de marmoreio perfeita, sabor incomparável. <strong>Corte mais desejado pelos clientes - vende por si só.</strong> Tipo A garante padrão superior.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por porção: R$ 11,82 (250g). Preço de venda: R$ 45-60. Margem: 380%. Destaque no rodízio.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 59,12</span>
              <a href="https://www.marquesvendaspmg.shop/produto/603" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR PICANHA →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CORTES PREMIUM ACESSÍVEIS -->
    <section style="margin-bottom: 40px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">⭐ Cortes Premium Acessíveis: Qualidade que Não Pesa no Bolso</h2>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">2. Contra Filé Bovino Resfriado com Noix Boi Brasil 3kg - O Versátil</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/contra-file-bovino-resfriado-com-noix-boi-brasil-3-kg-pmg-atacadista.jpg" 
               alt="Contra Filé Bovino Boi Brasil 3kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Maciez garantida, sabor intenso. <strong>Versátil para churrasco, grelhados e pratos especiais.</strong> Com noix - aproveitamento superior.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por porção: R$ 7,14 (250g). Preço venda: R$ 28-38. Margem: 350%. Alto rendimento.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 42,83</span>
              <a href="https://www.marquesvendaspmg.shop/produto/542" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR CONTRA FILÉ →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style="background: #fff; border: 2px solid #e0e0e0; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
        <h3 style="color: #095400; margin: 0 0 15px 0; font-size: 1.3rem;">3. Miolo da Alcatra Bovina Resfriado Jordanésia 3,5kg - O Clássico Brasileiro</h3>
        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 20px; align-items: start;">
          <img src="https://www.marquesvendaspmg.shop/images/miolo-da-alcatra-bovina-resfriado-jordanesia-35-kg-pmg-atacadista.jpg" 
               alt="Miolo da Alcatra Jordanésia 3,5kg - PMG Atacadista" 
               style="width: 100%; border-radius: 8px;" />
          <div>
            <p><strong>Análise PMG:</strong> Textura firme, sabor marcante. <strong>O corte mais popular do rodízio brasileiro.</strong> Jordanésia - qualidade comprovada.</p>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0; font-weight: 600;">💡 <strong>Estratégia PMG:</strong> Custo por porção: R$ 5,90 (250g). Preço venda: R$ 22-30. Margem: 320%. Carro-chefe do rodízio.</p>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
              <span style="font-size: 1.3rem; font-weight: 700; color: #095400;">R$ 41,27</span>
              <a href="https://www.marquesvendaspmg.shop/produto/592" 
                 target="_blank"
                 style="background: #095400; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; transition: all 0.3s ease;">
                 COMPRAR ALCATRA →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TABELA COMPARATIVA -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">📊 Tabela Comparativa: Cortes Bovinos PMG Atacadista</h2>
      
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #095400; color: white;">
              <th style="padding: 15px; text-align: left;">Corte</th>
              <th style="padding: 15px; text-align: center;">Categoria</th>
              <th style="padding: 15px; text-align: center;">Peso</th>
              <th style="padding: 15px; text-align: center;">Preço Atacado</th>
              <th style="padding: 15px; text-align: center;">Custo Porção 250g</th>
              <th style="padding: 15px; text-align: center;">Margem</th>
              <th style="padding: 15px; text-align: center;">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Picanha Boi Brasil</td>
              <td style="padding: 15px; text-align: center;">Nobre</td>
              <td style="padding: 15px; text-align: center;">1,3 kg</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 59,12</td>
              <td style="padding: 15px; text-align: center; font-weight: 600;">R$ 11,82</td>
              <td style="padding: 15px; text-align: center; color: #27ae60; font-weight: 600;">380%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/603" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 15px; font-weight: 600;">Contra Filé Boi Brasil</td>
              <td style="padding: 15px; text-align: center;">Premium</td>
              <td style="padding: 15px; text-align: center;">3 kg</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 42,83</td>
              <td style="padding: 15px; text-align: center; font-weight: 600;">R$ 7,14</td>
              <td style="padding: 15px; text-align: center; color: #27ae60; font-weight: 600;">350%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/542" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; font-weight: 600;">Alcatra Jordanésia</td>
              <td style="padding: 15px; text-align: center;">Premium</td>
              <td style="padding: 15px; text-align: center;">3,5 kg</td>
              <td style="padding: 15px; text-align: center; font-weight: 700; color: #095400;">R$ 41,27</td>
              <td style="padding: 15px; text-align: center; font-weight: 600;">R$ 5,90</td>
              <td style="padding: 15px; text-align: center; color: #f39c12; font-weight: 600;">320%</td>
              <td style="padding: 15px; text-align: center;">
                <a href="https://www.marquesvendaspmg.shop/produto/592" 
                   target="_blank"
                   style="background: #095400; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; font-weight: 600;">
                   COMPRAR
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ESTRATÉGIA DE RODÍZIO -->
    <section style="background: linear-gradient(135deg, #095400, #0a6b00); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
      <h2 style="margin: 0 0 15px 0; font-size: 1.5rem;">🎯 Estratégia PMG: Mix Perfeito para Rodízio</h2>
      <p style="margin: 0 0 20px 0; font-size: 1.1rem;">Baseado em nossa experiência com mais de 80 churrascarias:</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">👑</div>
          <h4 style="margin: 0 0 8px 0;">Destaque Premium</h4>
          <p style="margin: 0; font-size: 0.9rem;">Picanha (15-20% do mix)</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">⭐</div>
          <h4 style="margin: 0 0 8px 0;">Base do Rodízio</h4>
          <p style="margin: 0; font-size: 0.9rem;">Alcatra + Contra Filé (40-50%)</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🔥</div>
          <h4 style="margin: 0 0 8px 0;">Alto Giro</h4>
          <p style="margin: 0; font-size: 0.9rem;">Cortes econômicos (30-35%)</p>
        </div>
        
        <div style="text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 10px;">💼</div>
          <h4 style="margin: 0 0 8px 0;">Estratégico</h4>
          <p style="margin: 0; font-size: 0.9rem;">Especiais da casa (5-10%)</p>
        </div>
      </div>
    </section>

    <!-- DICAS DE PREPARO E CORTE -->
    <section style="margin-bottom: 30px;">
      <h2 style="color: #095400; font-size: 1.4rem; margin-bottom: 20px;">🔪 Dicas PMG: Preparo e Corte Profissionais</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px;">
          <h4 style="color: #095400; margin: 0 0 10px 0;">🥩 Picanha Perfeita</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Corte em fatias de 2-3 cm</li>
            <li>Gordura para cima na grelha</li>
            <li>Sal grosso apenas</li>
            <li>Ponto para mal passada</li>
          </ul>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px;">
          <h4 style="color: #095400; margin: 0 0 10px 0;">🔥 Contra Filé Ideal</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Fatiar contra a fibra</li>
            <li>Tempero seco 2h antes</li>
            <li>Grelha muito quente</li>
            <li>Ponto mal ao médio</li>
          </ul>
        </div>
        
        <div style="background: #f8f8f8; padding: 20px; border-radius: 8px;">
          <h4 style="color: #095400; margin: 0 0 10px 0;">💎 Alcatra Premium</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Remover excesso de gordura</li>
            <li>Corte em bifes grossos</li>
            <li>Marinar opcional</li>
            <li>Todos os pontos</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- GESTÃO DE ESTOQUE E CUSTOS -->
    <section style="background: #f8f8f8; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
      <h2 style="color: #095400; margin: 0 0 15px 0; font-size: 1.4rem;">💼 Gestão PMG: Controle de Estoque e Custos</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">📦 Estoque Ideal</h4>
          <p style="margin: 0; font-size: 0.9rem;">Picanha: 2-3 dias | Alcatra: 3-4 dias | Contra Filé: 4-5 dias</p>
        </div>
        
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">💰 Cálculo de Consumo</h4>
          <p style="margin: 0; font-size: 0.9rem;">Rodízio: 400-500g por pessoa | À la carte: 250-300g</p>
        </div>
        
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">🌡️ Conservação</h4>
          <p style="margin: 0; font-size: 0.9rem;">0-4°C em embalagem original | Nunca recongelar</p>
        </div>
        
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">🎯 Pedido Inteligente</h4>
          <p style="margin: 0; font-size: 0.9rem;">Segundas e quintas - picos de qualidade</p>
        </div>
      </div>
    </section>

    <!-- CALCULADORA DE LUCRO -->
    <section style="background: #e8f5e8; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
      <h2 style="color: #095400; margin: 0 0 15px 0; font-size: 1.4rem;">🧮 Calculadora PMG: Seu Lucro com Nossos Cortes</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; text-align: center;">
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Picanha</h4>
          <p style="margin: 0; font-size: 0.9rem;">Investimento: R$ 59,12<br>Retorno: R$ 236-295<br>Lucro: R$ 177-236</p>
        </div>
        
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Contra Filé</h4>
          <p style="margin: 0; font-size: 0.9rem;">Investimento: R$ 42,83<br>Retorno: R$ 171-214<br>Lucro: R$ 128-171</p>
        </div>
        
        <div>
          <h4 style="color: #095400; margin: 0 0 8px 0;">Alcatra</h4>
          <p style="margin: 0; font-size: 0.9rem;">Investimento: R$ 41,27<br>Retorno: R$ 165-206<br>Lucro: R$ 124-165</p>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION FINAL -->
    <section style="text-align: center; padding: 40px; background: #f0f8f0; border-radius: 10px; margin-top: 30px;">
      <h2 style="color: #095400; margin: 0 0 15px 0; font-size: 1.6rem;">🚀 Pronto para Revolucionar Sua Churrascaria?</h2>
      <p style="color: #555; margin: 0 0 25px 0; font-size: 1.1rem;">
        Nossos especialistas em carnes da PMG Atacadista criam um plano personalizado baseado no seu público e localização.
      </p>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <a href="https://www.marquesvendaspmg.shop/categoria/derivados-de-bovino" 
           style="background: #095400; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease;">
           VER TODOS OS CORTES
        </a>
        
        <a href="https://wa.me/5511913572902?text=Olá! Gostaria de uma consultoria para montar o mix de carnes da minha churrascaria." 
           style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1.1rem; transition: all 0.3s ease;">
           CONSULTORIA GRATUITA
        </a>
      </div>
      
      <p style="color: #666; margin: 20px 0 0 0; font-size: 0.9rem;">
        🥩 <strong>Especialista PMG:</strong> Temos açougueiros e chefs para assessoria | 📦 <strong>Entrega:</strong> Todo Grande SP com cadeia de frio
      </p>
    </section>
  `
}
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // FILTRAGEM DOS ARTIGOS
  const filteredArticles = articles;

  // PAGINAÇÃO
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Blog PMG Atacadista - Receitas, Dicas e Produtos para Food Service</title>
        <meta name="description" content="Blog oficial da Marques Vendas PMG com receitas exclusivas, dicas para negócios food service e análises técnicas de produtos. Especialistas em atacado." />
      </Head>

      {/* ESTILOS GLOBAIS PARA MOBILE COM CORREÇÃO DAS LOGOS */}
      <style jsx global>{`
        /* RESET E BASE PARA RESPONSIVIDADE */
        .article-section,
        .article-content,
        .product-content,
        .table-container,
        .cta-section,
        .highlight-box,
        .premium-section {
          max-width: 100% !important;
          overflow-x: hidden !important;
          box-sizing: border-box !important;
        }

        /* CORREÇÃO DE OVERFLOW HORIZONTAL */
        body {
          overflow-x: hidden !important;
        }

        .article-section * {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }

        /* TABELAS RESPONSIVAS */
        .table-container {
          width: 100% !important;
          overflow-x: auto !important;
          margin: 15px 0 !important;
          -webkit-overflow-scrolling: touch !important;
        }

        .article-table {
          min-width: 100% !important;
          width: auto !important;
          border-collapse: collapse !important;
        }

        .article-table th,
        .article-table td {
          white-space: nowrap !important;
          padding: 10px 8px !important;
          font-size: 14px !important;
        }

        /* IMAGENS RESPONSIVAS - EXCETO LOGOS DO RODAPÉ */
        .article-img,
        .product-image,
        .article-image,
        img:not(.footer-logo) {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        /* BOTÕES E CTAs RESPONSIVOS */
        .cta-button,
        .product-button,
        .btn-comprar {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 5px 0 !important;
          text-align: center !important;
          box-sizing: border-box !important;
          white-space: normal !important;
          word-wrap: break-word !important;
        }

        .cta-buttons {
          flex-direction: column !important;
          gap: 10px !important;
          width: 100% !important;
        }

        /* CORREÇÃO PARA ELEMENTOS COM LARGURA FIXA */
        [style*="width:"],
        [style*="min-width:"],
        [style*="max-width:"] {
          max-width: 100% !important;
        }

        /* CORREÇÃO PARA DISPLAY GRID NO MOBILE */
        @media (max-width: 768px) {
          [style*="display: grid"] {
            display: flex !important;
            flex-direction: column !important;
          }

          [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }

        /* TIPOGRAFIA RESPONSIVA */
        .article-h2,
        .article-h3,
        .article-h4,
        .article-p {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
        }

        .article-p {
          line-height: 1.5 !important;
        }

        /* CONTAINERS ESPECÍFICOS */
        .highlight-box,
        .premium-section,
        .cta-section {
          padding: 20px 15px !important;
          margin: 15px 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* MEDIA QUERIES PARA MOBILE */
        @media (max-width: 768px) {
          /* FORÇA RESPONSIVIDADE EM TODOS OS ELEMENTOS */
          * {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* CORREÇÃO ESPECÍFICA PARA TABELAS */
          .table-container {
            margin: 10px 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          
          .article-table {
            font-size: 12px !important;
          }
          
          .article-table th,
          .article-table td {
            padding: 8px 6px !important;
            font-size: 12px !important;
          }
          
          /* CORREÇÃO PARA ELEMENTOS COM LARGURA ESPECÍFICA */
          [style*="width:"]:not([style*="width: 100"]):not([style*="width: auto"]) {
            width: 100% !important;
          }
          
          [style*="min-width:"] {
            min-width: 0 !important;
          }
          
          /* CORREÇÃO PARA PADDING QUE CAUSA OVERFLOW */
          [style*="padding:"] {
            padding-left: 15px !important;
            padding-right: 15px !important;
          }
          
          /* CORREÇÃO PARA MARGIN NEGATIVA */
          [style*="margin:"] {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          /* CORREÇÃO PARA FLEXBOX COM ITEMS FIXOS */
          [style*="display: flex"] {
            flex-wrap: wrap !important;
          }
          
          /* CORREÇÃO PARA GRID COM COLUNAS FIXAS */
          [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }

        @media (max-width: 480px) {
          /* AJUSTES ADICIONAIS PARA CELULARES PEQUENOS */
          .article-table th,
          .article-table td {
            padding: 6px 4px !important;
            font-size: 11px !important;
          }
          
          .cta-button,
          .product-button {
            padding: 12px 10px !important;
            font-size: 14px !important;
          }
          
          .highlight-box,
          .premium-section,
          .cta-section {
            padding: 15px 10px !important;
            margin: 10px 0 !important;
          }
        }

        /* CORREÇÃO ESPECÍFICA PARA ELEMENTOS COM overflow: visible */
        [style*="overflow: visible"] {
          overflow: hidden !important;
        }

        /* GARANTE QUE TODOS OS CONTAINERS TENHAM BOX-SIZING CORRETO */
        div, section, article, header, footer, main, aside, nav {
          box-sizing: border-box !important;
        }

        /* CORREÇÃO ESPECÍFICA PARA AS LOGOS DO RODAPÉ */
        .footer-logo {
          max-width: none !important;
          width: 22px !important;
          height: 22px !important;
          flex-shrink: 0 !important;
        }

        /* GARANTE QUE AS LOGOS DO FOOTER NÃO SEJAM AFETADAS PELOS ESTILOS GLOBAIS */
        footer img,
        .social-logo {
          max-width: none !important;
          width: auto !important;
          height: auto !important;
        }
		/* NO ESTILO GLOBAL - CORREÇÃO MAIS ESPECÍFICA */
img[alt="Markito"][src="https://i.imgur.com/J0BfsSj.gif"] {
  width: 60px !important;
  height: 60px !important;
  max-width: 60px !important;
  max-height: 60px !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
}

@media (max-width: 768px) {
  img[alt="Markito"][src="https://i.imgur.com/J0BfsSj.gif"] {
    width: 50px !important;
    height: 50px !important;
    max-width: 50px !important;
    max-height: 50px !important;
  }
}

@media (max-width: 480px) {
  img[alt="Markito"][src="https://i.imgur.com/J0BfsSj.gif"] {
    width: 44px !important;
    height: 44px !important;
    max-width: 44px !important;
    max-height: 44px !important;
  }
}
      `}</style>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '10px' : '20px',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
      }}>

        {/* HEADER OTIMIZADO PARA MOBILE */}
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '15px 0' : '30px 0',
          marginBottom: isMobile ? '15px' : '20px',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <div style={{
            backgroundColor: '#095400',
            padding: isMobile ? '6px 12px' : '10px 25px',
            borderRadius: '30px',
            marginBottom: isMobile ? '8px' : '15px',
            color: 'white',
            fontSize: isMobile ? '0.75rem' : '0.9rem',
            fontWeight: '600',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}>
            Marques Vendas PMG
          </div>
          
          <Link href="/">
            <img 
              src="https://i.imgur.com/pBH5WpZ.png" 
              alt="Marques Vendas PMG - Distribuidora Food Service" 
              style={{ 
                width: isMobile ? '160px' : '220px',
                margin: isMobile ? '8px 0' : '15px 0',
                filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.1))',
                cursor: 'pointer'
              }} 
            />
          </Link>
          
          <h1 style={{ 
            color: '#095400', 
            fontSize: isMobile ? '1.3rem' : '2rem',
            margin: isMobile ? '5px 0 8px' : '10px 0 15px',
            textAlign: 'center',
            fontWeight: '700',
            lineHeight: '1.3',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Blog PMG Atacadista
          </h1>
          
          <p style={{ 
            color: '#555', 
            fontSize: isMobile ? '0.85rem' : '1rem',
            maxWidth: '600px',
            textAlign: 'center',
            lineHeight: '1.5',
            marginBottom: isMobile ? '12px' : '20px',
            padding: isMobile ? '0 15px' : '0'
          }}>
            Conhecimento especializado em food service para alavancar seu negócio
          </p>

          <nav style={{
            marginBottom: isMobile ? '15px' : '20px',
            fontSize: isMobile ? '0.75rem' : '0.9rem',
            padding: isMobile ? '0 15px' : '0',
            textAlign: 'center'
          }}>
            <Link href="/" style={{ 
              color: '#095400', 
              textDecoration: 'none', 
              fontWeight: '600',
              display: 'inline-block',
              marginBottom: isMobile ? '5px' : '0'
            }}>
              Home
            </Link>
            <span style={{ 
              margin: isMobile ? '0 6px' : '0 8px', 
              color: '#999',
              display: isMobile ? 'none' : 'inline'
            }}>›</span>
            <span style={{ 
              color: '#666',
              display: 'inline-block'
            }}>
              Food News
            </span>
          </nav>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <main>
          {/* LISTA DE ARTIGOS - APENAS 1 POR PÁGINA */}
          {currentArticles.length > 0 ? (
            currentArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                isMobile={isMobile}
              />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: isMobile ? '30px 20px' : '40px',
              backgroundColor: '#f8f8f8',
              borderRadius: '10px',
              margin: isMobile ? '20px 0' : '30px 0'
            }}>
              <h3 style={{ 
                color: '#666', 
                marginBottom: '10px',
                fontSize: isMobile ? '1.1rem' : '1.3rem'
              }}>
                Nenhum artigo encontrado
              </h3>
              <p style={{ 
                color: '#999',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}>
                Tente alterar os filtros para ver mais artigos.
              </p>
            </div>
          )}

          {/* PAGINAÇÃO SIMPLIFICADA */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: isMobile ? '8px' : '10px',
              marginTop: isMobile ? '25px' : '30px',
              flexWrap: 'wrap',
              padding: isMobile ? '0 10px' : '0'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: isMobile ? '10px 15px' : '8px 16px',
                  backgroundColor: currentPage === 1 ? '#f0f0f0' : '#095400',
                  color: currentPage === 1 ? '#999' : '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  minWidth: isMobile ? '100px' : 'auto'
                }}
              >
                ← Anterior
              </button>

              <span style={{
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                color: '#666',
                fontWeight: '600',
                padding: isMobile ? '8px 12px' : '8px 12px'
              }}>
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: isMobile ? '10px 15px' : '8px 16px',
                  backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#095400',
                  color: currentPage === totalPages ? '#999' : '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  minWidth: isMobile ? '100px' : 'auto'
                }}
              >
                Próxima →
              </button>
            </div>
          )}
        </main>

{/* FOOTER SUPER COMPACTO PARA MOBILE */}
<footer style={{
  marginTop: isMobile ? '20px' : '50px',
  padding: isMobile ? '12px 8px' : '40px 20px',
  textAlign: 'center',
  color: '#666',
  fontSize: isMobile ? '0.65rem' : '0.85rem',
  borderTop: '1px solid #f0f0f0',
  backgroundColor: '#f9f9f9'
}}>

  {/* LINKS LEGAIS - UMA LINHA SÓ */}
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: isMobile ? '6px' : '12px',
    marginBottom: isMobile ? '8px' : '12px',
    flexWrap: 'wrap'
  }}>
    <Link href="/politica-de-privacidade" style={{ 
      color: '#095400', 
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: isMobile ? '0.6rem' : '0.75rem',
      whiteSpace: 'nowrap'
    }}>
      Política
    </Link>
    <span style={{ color: '#095400', fontSize: isMobile ? '0.5rem' : '0.7rem' }}>•</span>
    <Link href="/termos" style={{ 
      color: '#095400', 
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: isMobile ? '0.6rem' : '0.75rem',
      whiteSpace: 'nowrap'
    }}>
      Termos
    </Link>
    <span style={{ color: '#095400', fontSize: isMobile ? '0.5rem' : '0.7rem' }}>•</span>
    <Link href="/quem-somos" style={{ 
      color: '#095400', 
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: isMobile ? '0.6rem' : '0.75rem',
      whiteSpace: 'nowrap'
    }}>
      Quem Somos
    </Link>
  </div>

{/* REDES SOCIAIS - PEQUENINAS */}
<div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: isMobile ? '12px' : '15px',
  marginBottom: isMobile ? '8px' : '12px'
}}>
  <a href="https://www.facebook.com/MarquesVendaspmg" target="_blank" rel="noopener noreferrer">
    <img 
      src="https://i.imgur.com/prULUUA.png" 
      alt="Facebook" 
      className="footer-logo"
      style={{ 
        width: '22px', 
        height: '22px'
      }} 
    />
  </a>
  <a href="https://www.instagram.com/marquesvendaspmg" target="_blank" rel="noopener noreferrer">
    <img 
      src="https://i.imgur.com/I0ZZLjG.png" 
      alt="Instagram" 
      className="footer-logo"
      style={{ 
        width: '22px', 
        height: '22px'
      }} 
    />
  </a>
  <a href="https://www.youtube.com/@MarquesVendasPMG" target="_blank" rel="noopener noreferrer">
    <img 
      src="https://i.imgur.com/WfpZ8Gg.png" 
      alt="YouTube" 
      className="footer-logo"
      style={{ 
        width: '22px', 
        height: '22px'
      }} 
    />
  </a>
</div>

  {/* COPYRIGHT E ENDEREÇO - SUPER COMPACTO */}
  <div>
    <p style={{ 
      margin: isMobile ? '2px 0' : '4px 0', 
      fontSize: isMobile ? '0.6rem' : '0.75rem',
      color: '#666',
      lineHeight: '1.2'
    }}>
      © {new Date().getFullYear()} Marques Vendas PMG
    </p>
    <p style={{ 
      margin: isMobile ? '1px 0' : '3px 0', 
      fontSize: isMobile ? '0.55rem' : '0.7rem', 
      color: '#999',
      lineHeight: '1.1'
    }}>
      Estrada Ferreira Guedes, 784 - Itapecerica da Serra - SP
    </p>
  </div>
</footer>
      </div>
    </>
  );
}

// COMPONENTE DE CARTÃO DE ARTIGO OTIMIZADO PARA MOBILE
function ArticleCard({ article, isMobile }) {
  const relatedProducts = getRelatedProducts(article);

  return (
    <article style={{
      background: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      marginBottom: isMobile ? '25px' : '30px',
      border: '1px solid #f0f0f0',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    }}>
      
      {/* CABEÇALHO DO ARTIGO OTIMIZADO */}
      <div style={{
        padding: isMobile ? '20px 15px' : '25px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          marginBottom: isMobile ? '12px' : '15px',
          fontSize: isMobile ? '0.8rem' : '0.85rem',
          color: '#666',
          gap: isMobile ? '8px' : '10px'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '10px' : '15px', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            order: isMobile ? 2 : 1
          }}>
            <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
            <span style={{ display: isMobile ? 'none' : 'inline' }}>•</span>
            <span>{article.readTime}</span>
            <span style={{ display: isMobile ? 'none' : 'inline' }}>•</span>
            <span style={{
              backgroundColor: '#e8f5e8',
              color: '#095400',
              padding: isMobile ? '3px 10px' : '4px 12px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              marginTop: isMobile ? '5px' : '0'
            }}>
              {article.category}
            </span>
          </div>
          <span style={{ 
            fontSize: isMobile ? '0.75rem' : '0.8rem',
            order: isMobile ? 1 : 2
          }}>
            Por: {article.author}
          </span>
        </div>

        <h2 style={{
          color: '#095400',
          fontSize: isMobile ? '1.2rem' : '1.6rem',
          fontWeight: '700',
          margin: '0 0 12px 0',
          lineHeight: '1.3',
          wordWrap: 'break-word'
        }}>
          {article.title}
        </h2>

        <p style={{
          color: '#555',
          fontSize: isMobile ? '0.9rem' : '1rem',
          lineHeight: '1.5',
          margin: 0
        }}>
          {article.description}
        </p>
      </div>

      {/* IMAGEM DO ARTIGO OTIMIZADA */}
      <div style={{
        width: '100%',
        height: isMobile ? '200px' : '400px',
        overflow: 'hidden'
      }}>
        <img 
          src={article.image} 
          alt={article.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>

      {/* CONTEÚDO DO ARTIGO COM ESTILOS RESPONSIVOS */}
      <div style={{
        padding: isMobile ? '20px 15px' : '25px'
      }}>
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            fontSize: isMobile ? '0.9rem' : '1rem',
            lineHeight: '1.6',
            color: '#333',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
        />

        {/* PRODUTOS RELACIONADOS OTIMIZADOS */}
        {relatedProducts.length > 0 && (
          <section style={{
            backgroundColor: '#f8f8f8',
            padding: isMobile ? '20px 15px' : '25px',
            borderRadius: '10px',
            marginTop: isMobile ? '25px' : '30px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{
              color: '#095400',
              fontSize: isMobile ? '1.1rem' : '1.3rem',
              marginBottom: isMobile ? '15px' : '20px',
              textAlign: 'center',
              lineHeight: '1.3'
            }}>
              🛒 Produtos Relacionados
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: isMobile ? '15px' : '20px'
            }}>
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} isMobile={isMobile} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

// COMPONENTE DE PRODUTO REUTILIZÁVEL OTIMIZADO
function ProductCard({ product, isMobile }) {
  return (
    <div style={{
      backgroundColor: '#fff',
      padding: isMobile ? '15px' : '20px',
      borderRadius: '8px',
      textAlign: 'center',
      border: '1px solid #e0e0e0',
      transition: 'transform 0.3s ease',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img 
        src={product.image} 
        alt={product.name}
        style={{
          width: '100%',
          height: isMobile ? '120px' : '150px',
          objectFit: 'contain',
          borderRadius: '6px',
          marginBottom: isMobile ? '12px' : '15px',
          padding: isMobile ? '8px' : '10px',
          backgroundColor: '#f8f8f8',
          flexShrink: 0
        }}
      />
      <h4 style={{
        fontSize: isMobile ? '0.9rem' : '1rem',
        margin: '0 0 8px 0',
        color: '#333',
        lineHeight: '1.3',
        flex: 1,
        wordWrap: 'break-word'
      }}>
        {product.name}
      </h4>
      <p style={{
        fontSize: isMobile ? '1rem' : '1.2rem',
        fontWeight: '700',
        color: '#095400',
        margin: '0 0 12px 0',
        flexShrink: 0
      }}>
        R$ {product.price}
      </p>
      <a 
        href={`https://www.marquesvendaspmg.shop/produto/${product.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="product-button"
        style={{
          display: 'inline-block',
          padding: isMobile ? '10px 15px' : '10px 20px',
          backgroundColor: '#095400',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: isMobile ? '0.85rem' : '0.9rem',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          width: '100%',
          flexShrink: 0,
          boxSizing: 'border-box'
        }}
      >
        Comprar Agora
      </a>
    </div>
  );
}
