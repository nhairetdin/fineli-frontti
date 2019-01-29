import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'

const SiteInfoPopup = () => (
  <Popup
    trigger={<Icon name="info circle" size="large" color="blue" />}
    flowing
    hoverable
    position="bottom left">
    <Popup.Content>
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
    </Popup.Content>
  </Popup>
)

export default SiteInfoPopup
