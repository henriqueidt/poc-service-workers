const registerServiceWorker = async () => {
    if('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js')

            if(registration.installing) {
                console.log('Installing SW')
            } else if(registration.waiting) {
                console.log('SW installed')
            } else if(registration.active) {
                console.log('SW active')
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`)
        }
    }
}

registerServiceWorker()