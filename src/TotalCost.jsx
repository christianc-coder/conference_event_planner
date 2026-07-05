import "./TotalCost.css";

const TotalCost = ({ totalCosts, ItemsDisplay }) => {
  const totalMount = totalCosts.venue + totalCosts.addons + totalCosts.meals;

  return (
    <div className="pricing-app">
      <div className="display_box"> 
        <div className="header">
          <h3 className="preheading">
            <p>Total cost for the event</p>
          </h3>
        </div>
        <div>
          <h2 id="pre_fee_cost_display" className="price">
            ${totalMount}
          </h2>

          <div className="render_items">
            {ItemsDisplay}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalCost; 
