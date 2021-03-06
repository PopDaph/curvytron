/**
 * FPS Logger
 */
function FPSLogger(element)
{
    this.value   = 0;
    this.element = typeof(element) !== 'undefined' ? element : null;

    this.update = this.update.bind(this);
    this.log    = this.log.bind(this);

    this.start();
}

/**
 * Update
 *
 * @param {Number} step
 */
FPSLogger.prototype.update = function(step)
{
    var fps = step > 0 ? 1000/step : 60;

    this.value = ~~ (0.5 + (this.value ? (this.value + fps)/2 : fps));
};

/**
 * Log
 */
FPSLogger.prototype.log = function()
{
    this.draw();

    this.value = 0;
};

/**
 * Set element
 *
 * @param {DOMElement} element
 */
FPSLogger.prototype.setElement = function(element)
{
    this.element = element;
};

/**
 * Draw FPS
 */
FPSLogger.prototype.draw = function()
{
    if (this.element) {
        this.element.innerHTML = this.value + 'fps';
    }
};

/**
 * Start
 */
FPSLogger.prototype.start = function()
{
    if (!this.interval) {
        this.interval = setInterval(this.log, 1000);
    }
};

/**
 * Stop
 */
FPSLogger.prototype.stop = function()
{
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
    }
};
