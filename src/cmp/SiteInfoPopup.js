import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'

const SiteInfoPopup = () => (
  <Popup
    trigger={<Icon name="info circle" size="large" color="blue" />}
    flowing
    size='small'
    hoverable
    position="bottom left">
    <Popup.Content style={{ fontSize: '1.1rem' }}>
      <p>
        <b>Sivusto</b>
        <br />
        Tämä ei ole THL:n tuottama tai suosittelema palvelu, vaan avoimen datan pohjalta kehitetty erillinen sovellus.
      </p>
      <p>
        <b>Data</b>
        <br />
        Alkuperäislähde: Terveyden ja hyvinvoinnin laitos, Ravitsemusyksikkö. Fineli. Elintarvikkeiden
        koostumustietokanta. Versio 19. Helsinki 2018.
      </p>
      <hr/>
      <p>
        <b>Ohjeita</b><br/>
        Hiiren ollessa elintarvikerivin päällä (keskimmäinen taulukko), vasemmalla näkyvä keltainen palkki ja prosentti kertoo kunkin ravintotekijän määrän suhteessa päivittäiseen saantisuositukseen, kun annos on 100g.
        Hiiren ollessa ateriarivin päällä (kirjautunut käyttäjä), näytetään vastaavasti aterian sisältämien elintarvikkeiden yhteenlaskettu ravintotekijöiden suhteellinen määrä.
        Saantisuositukset perustuvat THL:n julkaisemiin tietoihin keskikokoiselle miehelle sekä naiselle. 
        <br/><br/>
        Jos painosi poikkeaa huomattavasti tästä, voit
        muuttaa suosituksia asetukset-sivulla (kirjautunut käyttäjä), tarkista käytettävä yksikkö vasemmalla näkyvästä taulukosta!
        Suurimmalle osalle ravintotekijöistä ei ole määritelty saantisuositusta oletuksena.
        <br/><br/>
        Voit suodattaa hakutulosta hakusanan, erityisruokavalion sekä sen sisältämien ravintotekijöiden määrän perusteella (sisältää vähintään).
        <br/><br/>
        <b>Elintarvikkeen lisääminen ateriaan (kirjautunut käyttäjä)</b><br/>
        1. Varmista, että oikea ateria on valittuna. Valittu ateria näkyy tummankeltaisella taustalla. <br/>
        2. Anna elintarvikkeen määrä grammoina oikealla olevaan kenttään ateriarivillä ja paina 'enter', jolloin elintarvike siirtyy ateriaan. <br/>
        3. Tallenna ateria. <br/><br/>
        Voit kopioida ja poistaa aterioita oikealla puolella sijaitsevista kuvakkeista.
      </p>
    </Popup.Content>
  </Popup>
)

export default SiteInfoPopup
