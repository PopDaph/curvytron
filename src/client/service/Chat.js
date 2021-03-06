/**
 * Chat system
 *
 * @param {SocketClient} client
 */
function Chat(client)
{
    BaseChat.call(this);

    this.client  = client;
    this.message = new Message(null, this.client);
    this.room    = null;
    this.$scope  = null;
    this.feed    = null;
    this.auto    = true;

    this.talk       = this.talk.bind(this);
    this.onTalk     = this.onTalk.bind(this);
    this.scrollDown = this.scrollDown.bind(this);
    this.onActivity = this.onActivity.bind(this);

    this.attachEvents();
}

Chat.prototype = Object.create(BaseChat.prototype);
Chat.prototype.constructor = Chat;

/**
 * Curvybot profile
 *
 * @type {Object}
 */
Chat.prototype.curvybot = {
    name: 'Curvybot',
    color: '#ff8069',
    icon: 'icon-megaphone'
};

/**
 * Attach events
 */
Chat.prototype.attachEvents = function()
{
    this.client.on('room:talk', this.onTalk);
};

/**
 * Detach events
 */
Chat.prototype.detachEvents = function()
{
    this.client.off('room:talk', this.onTalk);
};

/**
 * Set player
 *
 * @param {Player} player
 */
Chat.prototype.setPlayer = function(player)
{
    if (this.room) {
        this.message.player = player;
    }
};

/**
 * Set room
 *
 * @param {Room} room
 */
Chat.prototype.setRoom = function(room)
{
    if (!this.room || !this.room.equal(room)) {
        this.room = room;
        this.clearMessages();
    }
};

/**
 * Set scope
 */
Chat.prototype.setScope = function($scope)
{
    this.$scope = $scope;
    this.feed   = document.getElementById('feed');

    this.$scope.messages         = this.messages;
    this.$scope.submitTalk       = this.talk;
    this.$scope.currentMessage   = this.message;
    this.$scope.messageMaxLength = Message.prototype.maxLength;

    this.feed.addEventListener('scroll', this.onActivity);

    setTimeout(this.scrollDown, 0);
};

/**
 * Refresh
 */
Chat.prototype.refresh = function()
{
    try {
        this.$scope.$apply();
    } catch (e) {

    }

    if (this.auto) {
        this.scrollDown();
    }
};

/**
 * Scroll down
 */
Chat.prototype.scrollDown = function()
{
    if (this.feed) {
        this.feed.scrollTop = this.feed.scrollHeight;
    }
};

/**
 * Talk
 */
Chat.prototype.talk = function()
{
    var chat = this;

    if (this.message.content.length) {
        this.client.addEvent(
            'room:talk',
            this.message.serialize(),
            function (result) {
                if (result.success) {
                    chat.message.clear();
                } else {
                    console.error('Could not send %s', chat.message);
                }
            }
        );
    }
};

/**
 * On talk
 *
 * @param {Event} e
 */
Chat.prototype.onTalk = function(e)
{
    var data    = e.detail,
        player  = this.room.getPlayerByClient(data.client),
        message = new Message(data.content, data.client, player ? player : {name: data.name, color: data.color}, data.creation);

    this.addMessage(message);
    this.refresh();
};

/**
 * On activity
 *
 * @param {Event} e
 */
Chat.prototype.onActivity = function(e)
{
    if (this.feed) {
        this.auto = this.feed.scrollTop === this.feed.scrollHeight - this.feed.clientHeight;
    }
};

/**
 * Clear
 */
Chat.prototype.clear = function()
{
    this.clearMessages();

    if (this.feed) {
        this.feed.removeEventListener('scroll', this.onActivity);
        this.feed = null;
    }

    this.message = new Message(null, this.client);
    this.room    = null;
    this.$scope  = null;
};
