const frostybot_exchange_base = require('./exchange.base');
const frostybot_error = require('../classes/classes.error');
const frostybot_order = require('../classes/classes.order');
const frostybot_balance = require('../classes/classes.balance');
const frostybot_position = require('../classes/classes.position');
const frostybot_market = require('../classes/classes.market');

var context = require('express-http-context');
var binanceapi = require('node-binance-api-ext');


const BINANCE_ERROR_CODES = {
    '-1000': 'UNKNOWN',
    '-1001': 'DISCONNECTED',
    '-1002': 'UNAUTHORIZED',
    '-1003': 'TOO_MANY_REQUESTS',
    '-1004': 'DUPLICATE_IP',
    '-1005': 'NO_SUCH_IP',
    '-1006': 'UNEXPECTED_RESP',
    '-1007': 'TIMEOUT',
    '-1010': 'ERROR_MSG_RECEIVED',
    '-1011': 'NON_WHITE_LIST',
    '-1013': 'INVALID_MESSAGE',
    '-1014': 'UNKNOWN_ORDER_COMPOSITION',
    '-1015': 'TOO_MANY_ORDERS',
    '-1016': 'SERVICE_SHUTTING_DOWN',
    '-1020': 'UNSUPPORTED_OPERATION',
    '-1021': 'INVALID_TIMESTAMP',
    '-1022': 'INVALID_SIGNATURE',
    '-1023': 'START_TIME_GREATER_THAN_END_TIME',
    '-1100': 'ILLEGAL_CHARS',
    '-1101': 'TOO_MANY_PARAMETERS',
    '-1102': 'MANDATORY_PARAM_EMPTY_OR_MALFORMED',
    '-1103': 'UNKNOWN_PARAM',
    '-1104': 'UNREAD_PARAMETERS',
    '-1105': 'PARAM_EMPTY',
    '-1106': 'PARAM_NOT_REQUIRED',
    '-1108': 'BAD_ASSET',
    '-1109': 'BAD_ACCOUNT',
    '-1110': 'BAD_INSTRUMENT_TYPE',
    '-1111': 'BAD_PRECISION',
    '-1112': 'NO_DEPTH',
    '-1113': 'WITHDRAW_NOT_NEGATIVE',
    '-1114': 'TIF_NOT_REQUIRED',
    '-1115': 'INVALID_TIF',
    '-1116': 'INVALID_ORDER_TYPE',
    '-1117': 'INVALID_SIDE',
    '-1118': 'EMPTY_NEW_CL_ORD_ID',
    '-1119': 'EMPTY_ORG_CL_ORD_ID',
    '-1120': 'BAD_INTERVAL',
    '-1121': 'BAD_SYMBOL',
    '-1125': 'INVALID_LISTEN_KEY',
    '-1127': 'MORE_THAN_XX_HOURS',
    '-1128': 'OPTIONAL_PARAMS_BAD_COMBO',
    '-1130': 'INVALID_PARAMETER',
    '-1136': 'INVALID_NEW_ORDER_RESP_TYPE',
    '-2010': 'NEW_ORDER_REJECTED',
    '-2011': 'CANCEL_REJECTED',
    '-2013': 'NO_SUCH_ORDER',
    '-2014': 'BAD_API_KEY_FMT',
    '-2015': 'REJECTED_MBX_KEY',
    '-2016': 'NO_TRADING_WINDOW',
    '-2018': 'BALANCE_NOT_SUFFICIENT',
    '-2019': 'MARGIN_NOT_SUFFICIENT',
    '-2020': 'UNABLE_TO_FILL',
    '-2021': 'ORDER_WOULD_IMMEDIATELY_TRIGGER',
    '-2022': 'REDUCE_ONLY_REJECT',
    '-2023': 'USER_IN_LIQUIDATION',
    '-2024': 'POSITION_NOT_SUFFICIENT',
    '-2025': 'MAX_OPEN_ORDER_EXCEEDED',
    '-2026': 'REDUCE_ONLY_ORDER_TYPE_NOT_SUPPORTED',
    '-2027': 'MAX_LEVERAGE_RATIO',
    '-2028': 'MIN_LEVERAGE_RATIO',
    '-4000': 'INVALID_ORDER_STATUS',
    '-4001': 'PRICE_LESS_THAN_ZERO',
    '-4002': 'PRICE_GREATER_THAN_MAX_PRICE',
    '-4003': 'QTY_LESS_THAN_ZERO',
    '-4004': 'QTY_LESS_THAN_MIN_QTY',
    '-4005': 'QTY_GREATER_THAN_MAX_QTY',
    '-4006': 'STOP_PRICE_LESS_THAN_ZERO',
    '-4007': 'STOP_PRICE_GREATER_THAN_MAX_PRICE',
    '-4008': 'TICK_SIZE_LESS_THAN_ZERO',
    '-4009': 'MAX_PRICE_LESS_THAN_MIN_PRICE',
    '-4010': 'MAX_QTY_LESS_THAN_MIN_QTY',
    '-4011': 'STEP_SIZE_LESS_THAN_ZERO',
    '-4012': 'MAX_NUM_ORDERS_LESS_THAN_ZERO',
    '-4013': 'PRICE_LESS_THAN_MIN_PRICE',
    '-4014': 'PRICE_NOT_INCREASED_BY_TICK_SIZE',
    '-4015': 'INVALID_CL_ORD_ID_LEN',
    '-4016': 'PRICE_HIGHTER_THAN_MULTIPLIER_UP',
    '-4017': 'MULTIPLIER_UP_LESS_THAN_ZERO',
    '-4018': 'MULTIPLIER_DOWN_LESS_THAN_ZERO',
    '-4019': 'COMPOSITE_SCALE_OVERFLOW',
    '-4020': 'TARGET_STRATEGY_INVALID',
    '-4021': 'INVALID_DEPTH_LIMIT',
    '-4022': 'WRONG_MARKET_STATUS',
    '-4023': 'QTY_NOT_INCREASED_BY_STEP_SIZE',
    '-4024': 'PRICE_LOWER_THAN_MULTIPLIER_DOWN',
    '-4025': 'MULTIPLIER_DECIMAL_LESS_THAN_ZERO',
    '-4026': 'COMMISSION_INVALID',
    '-4027': 'INVALID_ACCOUNT_TYPE',
    '-4028': 'INVALID_LEVERAGE',
    '-4029': 'INVALID_TICK_SIZE_PRECISION',
    '-4030': 'INVALID_STEP_SIZE_PRECISION',
    '-4031': 'INVALID_WORKING_TYPE',
    '-4032': 'EXCEED_MAX_CANCEL_ORDER_SIZE',
    '-4033': 'INSURANCE_ACCOUNT_NOT_FOUND',
    '-4044': 'INVALID_BALANCE_TYPE',
    '-4045': 'MAX_STOP_ORDER_EXCEEDED',
    '-4046': 'NO_NEED_TO_CHANGE_MARGIN_TYPE',
    '-4047': 'THERE_EXISTS_OPEN_ORDERS',
    '-4048': 'THERE_EXISTS_QUANTITY',
    '-4049': 'ADD_ISOLATED_MARGIN_REJECT',
    '-4050': 'CROSS_BALANCE_INSUFFICIENT',
    '-4051': 'ISOLATED_BALANCE_INSUFFICIENT',
    '-4052': 'NO_NEED_TO_CHANGE_AUTO_ADD_MARGIN',
    '-4053': 'AUTO_ADD_CROSSED_MARGIN_REJECT',
    '-4054': 'ADD_ISOLATED_MARGIN_NO_POSITION_REJECT',
    '-4055': 'AMOUNT_MUST_BE_POSITIVE',
    '-4056': 'INVALID_API_KEY_TYPE',
    '-4057': 'INVALID_RSA_PUBLIC_KEY',
    '-4058': 'MAX_PRICE_TOO_LARGE',
    '-4059': 'NO_NEED_TO_CHANGE_POSITION_SIDE',
    '-4060': 'INVALID_POSITION_SIDE',
    '-4061': 'POSITION_SIDE_NOT_MATCH',
    '-4062': 'REDUCE_ONLY_CONFLICT',
    '-4063': 'INVALID_OPTIONS_REQUEST_TYPE',
    '-4064': 'INVALID_OPTIONS_TIME_FRAME',
    '-4065': 'INVALID_OPTIONS_AMOUNT',
    '-4066': 'INVALID_OPTIONS_EVENT_TYPE',
    '-4067': 'POSITION_SIDE_CHANGE_EXISTS_OPEN_ORDERS',
    '-4068': 'POSITION_SIDE_CHANGE_EXISTS_QUANTITY',
    '-4069': 'INVALID_OPTIONS_PREMIUM_FEE',
    '-4070': 'INVALID_CL_OPTIONS_ID_LEN',
    '-4071': 'INVALID_OPTIONS_DIRECTION',
    '-4072': 'OPTIONS_PREMIUM_NOT_UPDATE',
    '-4073': 'OPTIONS_PREMIUM_INPUT_LESS_THAN_ZERO',
    '-4074': 'OPTIONS_AMOUNT_BIGGER_THAN_UPPER',
    '-4075': 'OPTIONS_PREMIUM_OUTPUT_ZERO',
    '-4076': 'OPTIONS_PREMIUM_TOO_DIFF',
    '-4077': 'OPTIONS_PREMIUM_REACH_LIMIT',
    '-4078': 'OPTIONS_COMMON_ERROR',
    '-4079': 'INVALID_OPTIONS_ID',
    '-4080': 'OPTIONS_USER_NOT_FOUND',
    '-4081': 'OPTIONS_NOT_FOUND',
    '-4082': 'INVALID_BATCH_PLACE_ORDER_SIZE',
    '-4083': 'PLACE_BATCH_ORDERS_FAIL',
    '-4084': 'UPCOMING_METHOD',
    '-4085': 'INVALID_NOTIONAL_LIMIT_COEF',
    '-4086': 'INVALID_PRICE_SPREAD_THRESHOLD',
    '-4087': 'REDUCE_ONLY_ORDER_PERMISSION',
    '-4088': 'NO_PLACE_ORDER_PERMISSION',
    '-4104': 'INVALID_CONTRACT_TYPE',
    '-4114': 'INVALID_CLIENT_TRAN_ID_LEN',
    '-4115': 'DUPLICATED_CLIENT_TRAN_ID',
    '-4118': 'REDUCE_ONLY_MARGIN_CHECK_FAILED',
    '-4131': 'MARKET_ORDER_REJECT',
    '-4135': 'INVALID_ACTIVATION_PRICE',
    '-4137': 'QUANTITY_EXISTS_WITH_CLOSE_POSITION',
    '-4138': 'REDUCE_ONLY_MUST_BE_TRUE',
    '-4139': 'ORDER_TYPE_CANNOT_BE_MKT',
    '-4140': 'INVALID_OPENING_POSITION_STATUS',
    '-4141': 'SYMBOL_ALREADY_CLOSED',
    '-4142': 'STRATEGY_INVALID_TRIGGER_PRICE',
    '-4144': 'INVALID_PAIR',
    '-4161': 'ISOLATED_LEVERAGE_REJECT_WITH_POSITION',
    '-4164': 'MIN_NOTIONAL',
    '-4165': 'INVALID_TIME_INTERVAL',
    '-4183': 'PRICE_HIGHTER_THAN_STOP_MULTIPLIER_UP',
    '-4184': 'PRICE_LOWER_THAN_STOP_MULTIPLIER_DOWN'                    
}

module.exports = class frostybot_exchange_binance_futures extends frostybot_exchange_base {

    // Class constructor

    constructor(stub = undefined) {
        super({stub: stub});        
        this.type = 'futures'                        // Exchange subtype
        this.shortname = 'binance_futures'           // Abbreviated name for this exchange
        this.description = 'Binance USD-M Futures'   // Full name for this exchange
        this.has_subaccounts = false                 // Subaccounts supported?
        this.has_testnet = true                      // Test supported?
        this.stablecoins = ['USDT','BUSD'];          // Stablecoins supported on this exchange
        this.order_sizing = 'base';                  // Exchange requires base size for orders
        this.collateral_assets = ['USDT','BUSD'];    // Assets that are used for collateral
        this.exchange_symbol = 'symbol';             // Does CCXT use the ID or the Symbol field?
        this.balances_market_map = '{currency}USDT'  // Which market to use to convert non-USD balances to USD
        this.orders_symbol_required = true;          // This exchange requires a symbol when fetching orders
        this.param_map = {                           // Order parameter mappings
            limit              : 'LIMIT',
            market             : 'MARKET',
            stoploss_limit     : 'STOP',
            stoploss_market    : 'STOP_MARKET',
            takeprofit_limit   : 'TAKE_PROFIT', 
            takeprofit_market  : 'TAKE_PROFIT_MARKET',
            take_profit_limit  : 'TAKE_PROFIT', 
            take_profit_market : 'TAKE_PROFIT_MARKET',
            trailing_stop      : 'TRAILING_STOP_MARKET', 
            post               : null,                // TODO
            reduce             : 'reduceOnly',
            timeInForce        : 'timeInForce',                // TODO
            tag                : null,                // TODO
            trigger            : 'stopPrice',
        };
        this.markets_by_id = null;
        this.map_mod()
        this.initialize()
    }

    // Initialize exchange

    async initialize() {
        //await this.markets();
        if (this.stub != undefined) {
            var options = {
                APIKEY: String(this.stub.parameters.apikey),
                APISECRET: String(this.stub.parameters.secret),
                useServerTime: true,
                recvWindow: 60000,
                verbose: true,
                log: function(params) {
                    global.frostybot.modules.output.api('binance_futures', params);
                }
            }
            try {
                this.binance = binanceapi(options);
            } catch (e) {
                return false;
            }
              
            /*
            if (this.binance && this.stub.parameters.apikey == 'cUV8Nkhw7Y9w6LSSYQkgVYgCoyiQUhN8FlCE4Gn661l23pHRuEpbXn4zFK6iRXjk') {
             
                this.binance.webSocket.userData(
                    (data) => {
                        cconsole.info(data);
                    },
                    (data) => {
                        console.info(data);
                    }
                );
            }
            */

        }
        await this.load_markets();
    }


    // Test API Keys

    async test(apikey, secret, testnet = false) {
        try {
            var testapi = require('node-binance-api-ext');
            var test = testapi({
                APIKEY: apikey,
                APISECRET: secret,
                useServerTime: true,
                recvWindow: 60000,
                test: String(testnet) == 'true' ? true : false
            });
            await test.futures.balance();
            return true;
        } catch(e) {
            return false;
        }
    }

    // Custom params

    async custom_params(params) {
        var [type, order, custom, command] = params

        // Add Binance Broker ID if configured

        if (['long', 'short', 'buy', 'sell', 'close'].includes(type)) {
            var brokerid = await this.mod.config.get('core:binancebrokerid', false);
            if (![undefined, false].includes(brokerid)) {
                order.params['newClientOrderId'] = 'x-' + brokerid.toUpperCase();
            }
        }

        // Check account to see if hedge mode is enabled

        var hedgemode = await this.mod.accounts.get_hedge_mode({stub: command.stub})            

        var accounthedgemode = hedgemode.enabled;                               // Account Hedge mode
        var commandhedgemode = ['long', 'short'].includes(command.direction)    // Hedge mode implied in command

        order.params['positionSide'] = (accounthedgemode ? (commandhedgemode ? command.direction : 'long') : 'both').toUpperCase()
        if (order.params.reduceOnly != undefined && commandhedgemode == true) delete order.params.reduceOnly

        return order;
    }  
    
    // Load Markets

    async load_markets() {

        if (this.markets_by_id != null) return true;

        var _this = this;
        var cachekey = ['binance_futures', 'markets'].join(':');
        let markets = await this.mod.cache.method(cachekey, 60, async () => {
            return await _this.markets(true);
        });

        var markets_by_id = {};
        markets.forEach(market => {
            markets_by_id[market.id] = market;
        })
        this.markets_by_id = markets_by_id;
        if (global.frostybot == undefined) global['frostybot'] = {};
        if (global.frostybot.markets == undefined) global['frostybot']['markets'] = {};
        global.frostybot.markets['binance_futures'] = markets_by_id;

    }

    /*
    balance_data(data) {
        console.log(data)
    }

    exec_data(data) {
        console.log(data)
    }
    */

    // Start account data stream

    async start_account_data_stream() {
        /*
        let endpoints = this.binance.webSocket.subscriptions();
            for (let endpoint in endpoints) {
            console.log(endpoint);
            await this.binance.webSockets.terminate(endpoint);
        }
        //console.log(this.binance)
        var streamid = await this.binance.webSocket.userMarginData(this.balance_data, this.exec_data);
        return streamid;
        */
       return  true;
    }

    // Set leverage for symbol

    async leverage(params) {
        var [symbol, type, leverage] = this.mod.utils.extract_props(params, ['symbol', 'type', 'leverage']);
        //var market = await this.find_market(symbol);
        //symbol = market.id;
        var type = (type == 'cross' ? 'CROSSED' : (type == 'isolated' ? 'ISOLATED' : null));
        var leverage = leverage.toLowerCase().replace('x', '');
        try { 
            await this.binance.futures.marginType(symbol, type);
        } catch (e) {}
        var leverageResult = await this.binance.futures.leverage(symbol, leverage);
        if ((leverageResult.hasOwnProperty('leverage')) && (leverageResult.leverage == leverage)) {
            return true;
        } else {
            return false;
        }
    }

    // Get hedge mode configuratiom

    async get_hedge_mode() {
        var position_mode = await this.binance.futures.positionMode();
        var dual = position_mode.dualSidePosition || false;
        return dual;
    }

    // Enable hedge mode

    async enable_hedge_mode() {
        try {
            var result = await this.binance.futures.changePositionMode(true);
            return result.code == 200 ? true : false
        } catch(e) {
            return e.code == -4059 ? true : new frostybot_error(e.msg || e.message, e.code)
        }
    }

    // Disable hedge mode

    async disable_hedge_mode() {
        try {
            var result = await this.binance.futures.changePositionMode(false);
            return result.code == 200 ? true : false
        } catch(e) {
            return e.code == -4059 ? true : new frostybot_error(e.msg || e.message, e.code)
        }
    }

    // Create a market order

    async create_market_order(side, symbol, amount, order_params = {}) {
        try {
            return side.toUpperCase() == 'BUY' ? await this.binance.futures.marketBuy(symbol, amount, order_params) : await this.binance.futures.marketSell(symbol, amount, order_params)
        } catch (e) {
            throw new frostybot_error(e.msg, e.code);
        }
    }

    // Create a limit order

    async create_limit_order(side, symbol, amount, price, order_params = {}) {
        try {
            return side.toUpperCase() == 'BUY' ? await this.binance.futures.buy(symbol, amount, price, order_params) : await this.binance.futures.sell(symbol, amount, price, order_params)
        } catch (e) {
            throw new frostybot_error(e.msg, e.code);
        }
    }

    // Create a stop market order

    async create_stop_market_order(side, symbol, amount, trigger, order_params = {}) {
        try {
            return side.toUpperCase() == 'BUY' ? await this.binance.futures.stopMarketBuy(symbol, amount, trigger, order_params) : await this.binance.futures.stopMarketSell(symbol, amount, trigger, order_params)
        } catch (e) {
            throw new frostybot_error(e.msg, e.code);
        }
    }


    // Create a stop limit order

    async create_stop_limit_order(side, symbol, amount, price, trigger, order_params = {}) {
        try {
            return side.toUpperCase() == 'BUY' ? await this.binance.futures.stopLimitBuy(symbol, amount, price, trigger, order_params) : await this.binance.futures.stopLimitSell(symbol, amount, price, trigger, order_params)
        } catch (e) {
            throw new frostybot_error(e.msg, e.code);
        }
    }

    // Create a take profit market order

    async create_take_profit_market_order(side, symbol, amount, trigger, order_params = {}) {
        try {
            order_params['side'] = side.toUpperCase()
            order_params['type'] = this.param_map['take_profit_market'];
            order_params['stopPrice'] = trigger;
            order_params['timestamp'] = (new Date()).getTime();
            return side.toUpperCase() == 'BUY' ? await this.binance.futures.marketBuy(symbol, amount, order_params) : await this.binance.futures.marketSell(symbol, amount, order_params)
        } catch (e) {
            throw new frostybot_error(e.msg, e.code);
        }
    }

    // Create new order

    async create_order(params) {
        var symbol = params.symbol;
        var type = params.type;
        var side = params.side.toUpperCase();
        var amount = parseFloat(params.amount);
        var price = params.price == undefined ? false : params.price;
        var order_params = params.params
        var trigger = order_params.stopPrice !== undefined ? order_params.stopPrice : undefined;

        delete order_params.stopPrice;

        var order_params = params.params;
        var result = false;

        try {
            switch (type) {
                case 'MARKET'               :   result = await this.create_market_order(side, symbol, amount, order_params);
                                                break;
                case 'LIMIT'                :   result = await this.create_limit_order(side, symbol, amount, price, order_params);
                                                break;
                case 'STOP_MARKET'          :   result = await this.create_stop_market_order(side, symbol, amount, trigger, order_params);
                                                break;
                case 'STOP'                 :   result = await this.create_stop_limit_order(side, symbol, amount, price, trigger, order_params);
                                                break;
                case 'TAKE_PROFIT_MARKET'   :   result = await this.create_take_profit_market_order(side, symbol, amount, trigger, order_params);
                                                break;
                case 'TAKE_PROFIT'          :   result = await this.create_limit_order(side, symbol, amount, trigger, order_params);
                                                break;
            }
            if (result.code != undefined) {
                if (result.code < -1000) {
                    var message = result.msg || BINANCE_ERROR_CODES[result.code]
                    throw new Error('Binance: ' + result.code + ': ' + message)
                }
            }
        } catch (e) {
            if (e.code != undefined) {
                if (e.code < -1000) {
                    var message = e.msg || BINANCE_ERROR_CODES[e.code]
                    throw new Error('Binance: ' + e.code + ': ' + message)
                }
            }
            throw new Error('Unknown Error: ' + (e.msg || e.message || 'No message'));
        }
        if (result.status !== undefined) return this.parse_order(result);
    }

    // Get account balances

    async balances() {

        var cachekey = ['binance_futures', 'rawbalances', this.stub.uuid, this.stub.stub].join(':');
        let raw_balances = await this.mod.cache.method(cachekey, 5, async () => {
            return await this.binance.futures.balance();
        });

        const userinfo = {
            uuid: this.stub.uuid, 
            stub: this.stub.stub
        }

        var balances = [];
        if (this.mod.utils.is_object(raw_balances)) {
            for (const [currency, raw_balance] of Object.entries(raw_balances)) {
                if (raw_balance.total != 0) {
                    var balance = new frostybot_balance(userinfo, 'binance_futures', currency, raw_balance.available, raw_balance.total)
                    balances.push(balance);
                }
            }
        }

        return balances;

    }

    // Get list of current positions

    async positions() { 

        var cachekey = ['binance_futures', 'rawpositions', this.stub.uuid, this.stub.stub].join(':');
        let raw_positions = await this.mod.cache.method(cachekey, 5, async () => {
            return await this.binance.futures.positionRisk();
        });

        var positions = [];
        const userinfo = {
            uuid: this.stub.uuid, 
            stub: this.stub.stub
        }

        await this.load_markets();

        raw_positions
            .filter(raw_position => parseFloat(raw_position.positionAmt) != 0)
            .forEach(async (raw_position) => {
                const symbol = raw_position.symbol;
                const market = this.markets_by_id[symbol];
                const direction = raw_position.positionSide !== 'BOTH' ? raw_position.positionSide.toLowerCase() : (parseFloat(raw_position.positionAmt) < 0 ? 'short' : 'long');
                const size = parseFloat(raw_position.positionAmt);
                const entryPrice = parseFloat(raw_position.entryPrice);
                const liqPrice = parseFloat(raw_position.liquidationPrice);
                const position = new frostybot_position(userinfo, market, direction, size, entryPrice, liqPrice);
                positions.push(position)            
            })

        return positions;

    }

    // Get list of markets from exchange

    async markets() {

        let results = [];
        var cachekey = ['binance_futures', 'rawmarkets'].join(':');
        var raw_markets = await this.mod.cache.method(cachekey, 300, async () => {
            const axios = require( 'axios' );
            var response = await axios.get('https://fapi.binance.com/fapi/v1/exchangeInfo');
            if (response.status == 200) 
                return response.data;
            else
                return false;
        });
        var tickers = await this.tickers();
        var exchange = (this.shortname != undefined ? this.shortname : (this.constructor.name).split('_').slice(2).join('_'));
        raw_markets.symbols
            .filter(raw_market => raw_market.contractType.toUpperCase() == 'PERPETUAL' && raw_market.status.toUpperCase() == 'TRADING')
            .forEach(raw_market => {
                const id = raw_market.symbol;
                const prices = tickers[id] != undefined ? tickers[id] : {};
                const price_filters = raw_market.filters.filter(item => item.filterType.toUpperCase() == 'PRICE_FILTER');
                const size_filters = raw_market.filters.filter(item => item.filterType.toUpperCase() == 'LOT_SIZE');
                const price_filter = Array.isArray(price_filters) && price_filters.length >= 1 ? price_filters[0] : {};
                const size_filter = Array.isArray(size_filters) && size_filters.length >= 1 ? size_filters[0] : {};
                var market = new frostybot_market(exchange, id, {
                    assets: {
                        base: raw_market.baseAsset,
                        quote: raw_market.quoteAsset
                    },
                    prices: {
                        bid: parseFloat(prices.bid || null),
                        ask: parseFloat(prices.ask || null),        
                    },
                    metadata: {
                        index: {
                            id: id,                           // ID from exchange (BTCUSDT)
                            symbol: id.replace('USDT','/USDT'),   // CCXT backwards compatibility (BTC/USDT)
                            tradingview: 'BINANCE:' + id,              // Tradingview Chart Symbol (BINANCE:BTCUSDT)
                        },
                        type: 'futures',
                        expiration: null,
                        contract_size: 1,
                        precision: {
                            price: parseFloat(price_filter.tickSize || null),
                            amount: parseFloat(size_filter.stepSize || null),
                        },
                        limits: {
                            amount: {
                                min: parseFloat(size_filter.minQty || null),
                                max: parseFloat(size_filter.maxQty || null),
                            },
                            order_types: {
                                limit: raw_market.orderTypes.includes('LIMIT') ? true : false,
                                market: raw_market.orderTypes.includes('MARKET') ? true : false,
                                stoploss_limit: raw_market.orderTypes.includes('STOP') ? true : false,
                                stoploss_market: raw_market.orderTypes.includes('STOP_MARKET') ? true : false,
                                takeprofit_limit: raw_market.orderTypes.includes('TAKE_PROFIT') ? true : false,
                                takeprofit_market: raw_market.orderTypes.includes('TAKE_PROFIT_MARKET') ? true : false,
                                trailing_stop: raw_market.orderTypes.includes('TRAILING_STOP_MARKET') ? true : false,
                            }
                        }
                    } 
                });
                market.update();
                results.push(market);
            });
        return results;
    }

    // Get ticker

    async ticker(symbol) {
        var key = ['ticker', 'binance_futures', symbol].join(':');
        if (this.mod.redis.is_connected()) {
            var ticker = await this.mod.redis.get(key);
        } else {
            var ticker = global.frostybot != undefined ? (global.frostybot.tickers != undefined ? (global.frostybot.tickers['binance_futures'] != undefined ? global.frostybot.tickers['binance_futures'][symbol] : undefined) : undefined) : undefined;
        }
        return ticker != undefined ? ticker : { bid: null, ask: null };
    }

    // Fetch tickers

    async tickers() {
        if (this.mod.redis.is_connected()) {
            var result = await this.mod.redis.search(['ticker', 'binance_futures', '*'].join(':'));
            var tickers = {};
            if (this.mod.utils.is_object(result)) {
                var values = Object.values(result);
                if (values.length > 0) {
                    for (var i = 0; i < values.length; i++) {
                        var ticker = values[i];
                        tickers[ticker.symbol] = ticker;
                    }
                }
            }
            return tickers;
        } else {
            return global.frostybot != undefined ? (global.frostybot.tickers != undefined ? (global.frostybot.tickers['binance_futures'] != undefined ? global.frostybot.tickers['binance_futures'] : undefined) : undefined) : undefined;
        }

    }

    // Get specific order ID

    async order(params) {
        var symbol = params.symbol;
        //var market = await this.find_market(symbol);
        //symbol = market.id;
        var id = params.id;
        try {
            var result = await this.binance.futures.openOrders(symbol, {orderId: id});
            if (this.mod.utils.is_array(result) && result.length == 0) {
                var result = (await this.binance.futures.allOrders(symbol)).filter(order => order.orderId == id);
            }
        } catch (e) {
            throw new frostybot_error(e.msg, e.code)
        }
        return this.mod.utils.is_array(result) ? (result.length == 1 ? this.parse_order(result[0]) : false) : false;
    }   

    // Get open orders

    async open_orders(params) {
        var [symbol, since, limit] = this.mod.utils.extract_props(params, ['symbol', 'since', 'limit']);
        if ([undefined, false, '<ALL>', ''].includes(symbol)) {
            symbol = undefined;
        }
        if (since == undefined) since = (new Date()).getTime() - (1000 * 60 * 60 * 24 * 7)        
        try {
            var raw_orders = await this.binance.futures.openOrders(symbol, {since: since, limit: limit});
        } catch(e) {
            return new frostybot_error(e.msg, e.code)
        }
        let results = [];
        await this.load_markets();
        raw_orders.forEach(raw_order => {
            results.push(this.parse_order(raw_order));         
        })
        return results;
    }

    // Get all order history

    async all_orders(params) {
        var [symbol, since, limit] = this.mod.utils.extract_props(params, ['symbol', 'since', 'limit']);
        if ([undefined, false, '<ALL>', ''].includes(symbol)) {
            symbol = undefined
        }
        if (since == undefined) since = (new Date()).getTime() - (1000 * 60 * 60 * 24 * 7)        
        try {
            var raw_orders = await this.binance.futures.allOrders(symbol, {since: since, limit: limit});
        } catch(e) {
            return new frostybot_error(e.msg, e.code)
        }
        let results = [];
        await this.load_markets();
        raw_orders.forEach(raw_order => {
            results.push(this.parse_order(raw_order));         
        })
        return results;
    }

    // Cancel orders

    async cancel(params) {
        var [symbol, id] = this.mod.utils.extract_props(params, ['symbol', 'id']);
        var symbol = params.symbol;
        var id = params.id;
        if (['all', undefined].includes(id)) {
            var orders = await this.open_orders({symbol: symbol});
            if (params.direction != undefined) {
                orders = orders.filter(order => order.direction == params.direction);
                var error = false;
                orders.forEach(async (order, idx) => {
                    var id = order.id;
                    try {
                        var result = await this.binance.futures.cancelAll(symbol, {orderId: id})
                        if (result.code == 200) {
                            order.status = 'cancelled';
                            orders[idx] = order;
                        }
                    } catch (e) { error = e }
                })
                if (error !== false) throw new frostybot_error(error.msg, error.code);
            } else {
                try {
                    await this.binance.futures.cancelAll(symbol);
                } catch (e) {
                    throw new frostybot_error(e.msg, e.code);
                }
                orders.forEach((order, idx) => {
                    order.status = 'cancelled';
                    orders[idx] = order;
                })       
            }
            return orders;
        } else {
            if (id !== undefined) {
                try {
                    var order = await this.order({symbol: symbol, id: id})
                    var result = await this.binance.futures.cancelAll(symbol, {orderId: id});                    
                    order.status = 'cancelled';
                    return order;
                } catch(e) {
                    throw new frostybot_error(e.msg, e.code);
                }
            }
        }
        return false
    }

    // Cancel oirders by type

    async cancel_by_type(symbol, types = [], direction = undefined) {
        var openorders = await this.open_orders({symbol: symbol});
        var results = [];
        if (this.mod.utils.is_array(openorders)) {
            if (!this.mod.utils.is_array(types)) types = [types];            
            var orders = openorders.filter(order => types.includes(order.type) && [order.direction, undefined].includes(direction));
            for (var i = 0; i < orders.length; i++) {
                var result = await this.cancel({symbol: symbol, id: orders[i].id})
                results.push(result);
            }
        }
        return results
    }

    // Cancel Stoploss Orders

    async cancel_sl(params) {
        return await this.cancel_by_type(params.symbol, ['stoploss_limit', 'stoploss_market'], params.direction);
    }


    // Cancel Takeprofit Orders

    async cancel_tp(params) {
        return await this.cancel_by_type(params.symbol, ['takeprofit_limit', 'takeprofit_market'], params.direction);
    }


    // Parse raw order from exchange into Frostybot order object

    parse_order(raw_order) {
        if (typeof(raw_order) == 'frostybot_order') return raw_order;
        var market = this.markets_by_id[raw_order.symbol];
        const userinfo = {
            uuid: this.stub.uuid, 
            stub: this.stub.stub
        }
        var typemap = {};
        ['limit', 'market', 'stoploss_limit', 'stoploss_market', 'takeprofit_limit', 'takeprofit_market', 'trailing_stop'].forEach(ordertype => {
            typemap[this.param_map[ordertype]] = ordertype;
        })
        var statusmap = {
            'NEW'       : 'open',
            'FILLED'    : 'closed',
            'CANCELED'  : 'cancelled',
            'CANCELLED' : 'cancelled',
        }
        var id = raw_order.orderId;
        var timestamp = raw_order.updateTime;
        var type = typemap[raw_order.origType];
        var side = raw_order.side.toLowerCase();
        var positionside = raw_order.positionSide.toLowerCase();
        var direction = positionside == 'both' ? null : positionside;
        var avgPrice = parseFloat(raw_order.avgPrice);
        var ordPrice = parseFloat(raw_order.price);
        var price = ordPrice != 0 ? ordPrice : (avgPrice != 0 ? avgPrice : null)
        var triggerPrice = parseFloat(raw_order.stopPrice);
        var trigger = triggerPrice != 0 ? triggerPrice : null
        var size = parseFloat(raw_order.origQty)
        var filled = parseFloat(raw_order.executedQty)
        var status = statusmap[raw_order.status] || raw_order.status.toLowerCase();
        return new frostybot_order(userinfo, market, id, timestamp, type, direction, side, price, trigger, size, filled, status)
    }

}
