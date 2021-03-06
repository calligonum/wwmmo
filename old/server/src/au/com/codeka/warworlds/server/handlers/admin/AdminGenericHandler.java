package au.com.codeka.warworlds.server.handlers.admin;

import java.util.TreeMap;

import au.com.codeka.warworlds.server.RequestException;

public class AdminGenericHandler extends AdminHandler {
    @Override
    protected void get() throws RequestException {
        if (!isAdmin()) {
            return;
        }

        String path = getExtraOption() + getUrlParameter("path") + ".html";
        if (path.equals(getExtraOption()+".html")) {
            path = getExtraOption()+"index.html";
        }

        render(path, new TreeMap<String, Object>());
    }
}
