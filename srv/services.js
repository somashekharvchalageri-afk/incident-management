const cds = require('@sap/cds')
const { classify } = require('./ai/classifier')

class ProcessorService extends cds.ApplicationService {
  /** Registering custom event handlers */
  init() {
    this.before("UPDATE", "Incidents", (req) => this.onUpdate(req));
    this.before("CREATE", "Incidents", (req) => this.classifyIncident(req));

    cds.on('bootstrap', app => {
  app.use((req, _res, next) => {
    const t = req.headers.authorization?.split(' ')[1]
    if (t) {
      try {
        const p = JSON.parse(Buffer.from(t.split('.')[1], 'base64url'))
        console.log('DEBUG scopes:', JSON.stringify(p.scope), 'client:', p.client_id)
      } catch { /* ignore */ }
    }
    next()
  })
})

    return super.init();
  }

  async classifyIncident(req) {
    const { title, conversation } = req.data
    const result = await classify({ title, message: conversation?.[0]?.message })
    // 'M' is the schema default, so only override when nobody chose an urgency
    if (result.urgency && (!req.data.urgency_code || req.data.urgency_code === 'M'))
      req.data.urgency_code = result.urgency
    req.data.category ??= result.category
    req.data.aiRationale = result.rationale
  }

  /** Custom Validation */
  async onUpdate (req) {
    let closed = await SELECT.one(1) .from (req.subject) .where `status.code = 'C'`
    if (closed) req.reject `Can't modify a closed incident!`
  }
}
module.exports = { ProcessorService }
