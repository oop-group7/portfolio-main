package net.bestcompany.foliowatch.events;

import jakarta.servlet.ServletRequest;

public class Utils {
    public static String constructBaseUrl(ServletRequest request) {
        String HTTP = "http";
        String HTTPS = "https";
        String scheme = request.getScheme();
        String server = request.getServerName();
        int port = request.getServerPort();
        StringBuffer url = new StringBuffer(scheme).append("://").append(server);
        if (port > 0 && ((HTTP.equalsIgnoreCase(scheme) && port != 80) ||
                (HTTPS.equalsIgnoreCase(scheme) && port != 443))) {
            url.append(':').append(port);
        }
        return url.toString();
    }
}
