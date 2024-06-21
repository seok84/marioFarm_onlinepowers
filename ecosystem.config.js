module.exports = {
    apps: [
        {
            name: 'dives',
            exec_mode: 'fork',   // fork, cluster
            instances: '1', // max Or a number of instances  (cluster)
            script: './node_modules/nuxt/bin/nuxt.js',
            args: 'start'
        }
    ]
}