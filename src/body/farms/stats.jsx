export default function Stats() {
  return(
    <div className="stats-stripe">
                <div className="btn show-hide"></div>
                <div className="txt deposit-ttl">My total deposit:</div>
                <div className="txt total-deposit loading">&zwnj;</div>
                <div className="txt qbert-ttl">QBert pending:</div>
                <div className="txt qbert-pending loading">
                    <span className="amount"></span>
                    <span className="value"></span>
                </div>
                <div className="btn harvest-all disabled">Harvest All</div>
            </div>
  )
}