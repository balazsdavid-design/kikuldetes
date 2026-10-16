const cds = require('@sap/cds');

// Drafts may be incomplete while editing. Enforce this rule when an active
// posting is created/updated (including draft activation), before saving it.
async function validateCylinderVolume(req) {
    let data = req.data;
    if (req.event === 'UPDATE' && (data.fuel_type_ID === undefined || data.cylinder_volume === undefined)) {
        const current = await cds.tx(req).run(
            SELECT.one.from(req.target).columns('fuel_type_ID', 'cylinder_volume').where({ ID: data.ID })
        );
        data = { ...current, ...data };
    }
    // Fuel type 5 is the electric type used by the existing PDF calculation.
    if (Number(data.fuel_type_ID) !== 5 &&
        (!Number.isInteger(Number(data.cylinder_volume)) || Number(data.cylinder_volume) <= 0)) {
        req.error(400, 'CylinderVolumeRequired', 'cylinder_volume');
    }
}

module.exports = { validateCylinderVolume };
