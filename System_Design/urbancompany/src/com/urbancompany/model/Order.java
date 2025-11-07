package urbancompany.src.com.urbancompany.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class Order {
    private final String id;
    private final String userId;
    private final String companyId;
    private final String serviceId;
    private final LocalDateTime scheduledFor;
    private OrderStatus status;
    private String paymentId;

    public Order(String userId, String companyId, String serviceId, LocalDateTime scheduledFor) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.companyId = companyId;
        this.serviceId = serviceId;
        this.scheduledFor = scheduledFor;
        this.status = OrderStatus.PENDING;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getCompanyId() {
        return companyId;
    }

    public String getServiceId() {
        return serviceId;
    }

    public LocalDateTime getScheduledFor() {
        return scheduledFor;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", serviceId='" + serviceId + '\'' +
                ", scheduledFor=" + scheduledFor +
                ", status=" + status +
                (paymentId != null ? ", paymentId='" + paymentId + '\'' : "") +
                '}';
    }
}
