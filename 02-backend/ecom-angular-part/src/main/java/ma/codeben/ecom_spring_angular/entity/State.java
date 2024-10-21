package ma.codeben.ecom_spring_angular.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "state")
@Data
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "id")
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;
}
