DecodeBtn = {
    getClipboardText: function() {
        var clip = Components.classes['@mozilla.org/widget/clipboard;1']
            .getService(Components.interfaces.nsIClipboard);
        if (!clip) return null;

        var trans = Components.classes['@mozilla.org/widget/transferable;1']
            .createInstance(Components.interfaces.nsITransferable);
        if (!trans) return null;

        if (typeof(trans.init) === 'function')
            trans.init(null);

        trans.addDataFlavor("text/unicode");
        clip.getData(trans,
                clip.supportsSelectionClipboard()
                ? clip.kSelectionClipboard
                : clip.kGlobalClipboard
        );

        var s = new Object;
        var p;
        var len = new Object;
        trans.getTransferData("text/unicode", s, len);

        var text = null;
        var res;

        if (s)
            p = s.value.QueryInterface(Components.interfaces.nsISupportsString, res);
        if (p)
            text = p.data.substring(0, len.value / 2);

        return text;
    },
    trim_keyword: function(word) {
        if (!word) return word;

        var oldword;
        do {
            oldword = word;

            word = word.replace(/^[^a-zA-Z0-9]+/, '');
            word = word.replace(/[^a-zA-Z0-9]+$/, '');
            word = word.replace(/^Bug#/i, '');
        } while ( oldword != word );

        return word;
    },
    lookup_decode: function(in_new) {
        var keyword = DecodeBtn.trim_keyword(DecodeBtn.getClipboardText());
        var uri="";

        if (keyword) uri = decodeURIComponent(keyword);

        if (in_new) {
            var b = getBrowser();
            var new_tab = b.addTab(uri);
            b.selectedTab = new_tab;
        }
        else {
            loadURI(uri);
        }
    },

    decodeButton: function (e) {
        if ( e.button == 0 )
            DecodeBtn.lookup_decode(false)
        else if ( e.button == 1 )
            DecodeBtn.lookup_decode(true);
    }
}

