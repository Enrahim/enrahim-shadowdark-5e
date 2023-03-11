import {applications} from "../../systems/dnd5e/dnd5e.mjs";


Hooks.once('setup', () => {
    console.log("shadowdark5e | setup");

    class ActorSheetShadowdark5e extends applications.actor.ActorSheet5eCharacter {

        async getData(options) {
            let result = await super.getData();
            let xp = result.system.details.xp;
            xp.max = result.system.details.level * 10;
            xp.pct = Math.clamped(100 * xp.value/xp.max, 0, 100);
            return result;
        }

        async _renderInner(...args) {
            const selectorsToRemove = [
                '[data-tab="biography"]',
                '.proficiency',
                '.attribute.hit-dice',
                '.attribute.movement',
                '.skills-list',
                '.denomination.ep',
                '[name="system.currency.ep"]',
                '.counter.flexrow.death-saves',
                '.counter.flexrow.exhaustion',
                '[data-filter="action"]',
                '[data-filter="bonus"]',
                '[data-filter="reaction"]',
                '[data-filter="ritual"]',
            ]
            

            let html = await super._renderInner(...args)
            selectorsToRemove.forEach(selector => html.find(selector).remove());
            html.find('.counter.flexrow.inspiration').children('h4').html("Luck");
            html.find('[data-trait="languages"]').parent().siblings().remove();
            html.find('.tab.features').children('.inventory-filters').remove();
            return html
        }
    }

    Actors.registerSheet("shadowdark", ActorSheetShadowdark5e, {
        types: ["character"],
        makeDefault: true,
        label: "SHADOWDARK.SheetClassCharacter"
    })

    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
        const rules = styleSheets[i].cssRules;
        for (let j = 0; j<rules.length; j++) {
            if (rules[j].constructor.name == 'CSSStyleRule' && rules[j].selectorText == '.dnd5e.sheet.actor.character') {
                console.log("shadowdark5e | Shrinking minimum sheet width")
                rules[j].styleMap.set('min-width', '500px');
                return;
            }
        }
    }
    console.log("shadowdark5e | Couldn't find actor sheet css");

});