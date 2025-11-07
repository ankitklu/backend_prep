package urbancompany.src.com.urbancompany.service;

import com.urbancompany.model.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ServiceManager {
    private final Map<String, Service> services = new ConcurrentHashMap<>();

    public Service addService(Service service) {
        services.put(service.getId(), service);
        return service;
    }

    public Optional<Service> getServiceById(String id) {
        return Optional.ofNullable(services.get(id));
    }

    public List<Service> listAllServices() {
        return new ArrayList<>(services.values());
    }

    public List<Service> searchByTitle(String title) {
        List<Service> result = new ArrayList<>();
        for (Service s : services.values()) {
            if (s.getTitle().toLowerCase().contains(title.toLowerCase())) {
                result.add(s);
            }
        }
        return result;
    }
}
