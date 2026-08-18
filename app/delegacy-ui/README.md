# delegacy-ui

Fiori Elements OData V4 / Flexible Programming Model alkalmazás a meglévő `AppService` fölött.

## Felépítés

- **Custom Page kezdőoldal** három, középre rendezett füllel:
  - Saját autós kiküldetések
  - Külföldi/belföldi kiküldetések
  - Személyes adatok
- A két kiküldetési fül külön `FilterBar` + `Table` building blockot használ.
- A posting táblák `ForceMulti` kijelölési módot használnak, így a sorok listanézetben is kijelölhetők a kontextusfüggő műveletekhez és törléshez.
- A táblák standard Fiori Elements routinggal navigálnak a hozzájuk tartozó Object Page-re.
- A személyes adatok nem Employee listaként jelennek meg: elsőként a bejelentkezett shell user `ID` / e-mail azonosítójával keresi a saját Employee rekordot.
- A CAP `Employees` jogosultsága alapján normál user csak a saját rekordját látja. Ha több Employee rekord olvasható, elérhető a **Más dolgozó keresése** funkció; ez a meglévő `Backoffice` hozzáférésre támaszkodik.
- Más dolgozó kiválasztása után ugyanaz az Employee Object Page nyílik meg, és a tényleges módosítási jogosultságot továbbra is a CAP backend kényszeríti ki.
- A három részletes nézet továbbra is standard Fiori Elements **Object Page**.

## Megtartott meglévő funkciók

- CAP/Fiori draft flow (`@odata.draft.enabled` a meglévő service-ben)
- meglévő bound actionök: beküldés, visszaküldés, elutasítás, jóváhagyás
- a meglévő `submittable`, `backOffice`, `editing`, `accepted`, `restriction` alapú UI logika
- role/status alapú read-only mezők (`Common.FieldControl`)
- `@cap-js/attachments` csatolmány facetek a két posting Object Page-en
- PDF generáló header actionök

## Object Page redesign

A posting és Employee Object Page-ek `sectionLayout: "Page"` módot használnak. Így minden section egyetlen görgethető oldalon jelenik meg, felül anchor navigációval, a meglévő annotation-alapú szekciók megtartásával.

## i18n

A projektből kapott `i18n.properties` / `i18n_hu.properties` fordítások lettek alapul véve az üzleti mezőkhöz és szekciócímekhez. Az új workspace-specifikus feliratok külön kulcsokon maradtak.

## Fontos

A csomag **nem módosítja az `srv/` mappát**. Az UI a projektben jelenleg meglévő `AppService` szerződésére és `@restrict` szabályaira épül.

A `node_modules` és a generált `dist` mappa nincs benne a visszaadott csomagban.
