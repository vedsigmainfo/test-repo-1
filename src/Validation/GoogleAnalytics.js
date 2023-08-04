export function CallGA(page) {
    try {
        window.ga('send', {
            hitType: 'pageview',
            page: page
        });
    }
    catch(e) {

    }
}

export function CallGAEvent(control,action,comment) {
    try {
        window.ga('send', 'event', control, action,comment);
    }
    catch(e) {

    }
}